// import { useLoaderData } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { zfd } from "zod-form-data";
import slugify from "slugify";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { withZod } from "@remix-validated-form/with-zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  Link,
  useActionData,
  useFetcher,
  useLoaderData,
  useLocation,
  useSubmit,
} from "@remix-run/react";
import {
  DeleteIcon,
  Edit2Icon,
  Edit3Icon,
  FolderOpen,
  LayoutTemplate,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { retriveUser } from "@/utils/auth.utils.server";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Switch } from "@/components/ui/switch";
import { FormEvent, useEffect, useRef, useState } from "react";
import { db } from "@/db/db.server";
import { z } from "zod";
// import { Alert } from "@/components/ui/alert";
import { ValidatedForm, validationError } from "remix-validated-form";
import { Alert } from "@/components/ui/alert";
import FieldInput from "@/factory/FieldInput";
import { SubmitButton } from "@/factory/SubmitButton";
import FieldSwitch from "@/factory/FieldSwitch";
import { createToastHeaders } from "@/utils/toast.server";
import { Resume, User } from "@prisma/client";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import Delete from "./delete";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await retriveUser(request);

  const resumeofuser = await db.resume.findMany({
    where: {
      userId: user.id,
    },
  });

  return json<{
    user: User;
    resumeofuser: Resume[];
    hosturl: string;
  }>({
    user,
    resumeofuser,
    hosturl: process.env.HOST_URL!,
  });
}

export const schema = z.object({
  name: zfd.text(
    z.string({
      required_error: "First Name is a required field",
    })
  ),
  publicResume: zfd.checkbox(),
  templateResume: zfd.checkbox(),
});

const clientValidator = withZod(schema);

export async function action({ request }: ActionFunctionArgs) {
  const user = await retriveUser(request);

  const formData = await request.formData();

  const intent = formData.get("_intent");

  switch (intent) {
    case "create": {
      const serverValidator = withZod(
        schema.refine(
          async (data) => {
            const slugAvailable = await db.resume.isSlugAvailable(data.name);
            return slugAvailable;
          },
          {
            message: "Whoops! That resume name is taken.",
            path: ["username"],
          }
        )
      );

      const result = await serverValidator.validate(formData);

      if (result.error) {
        const toastHeaders = await createToastHeaders({
          type: "error",
          title: "Whoops!",
          description: "Resume name is not available.",
        });

        return json(
          {
            result,
          },
          {
            headers: toastHeaders,
          }
        );
      }

      const { name, publicResume, templateResume } = result.data;

      const newResume = await db.resume.create({
        data: {
          name,
          slug: slugify(name),
          public: publicResume,
          template: templateResume,
          userId: user.id,
        },
      });

      return json<{ success: boolean; newResume: Resume }>(
        {
          success: true,
          newResume,
        },
        {
          headers: await createToastHeaders({
            type: "success",
            title: "Success!",
            description: "Resume created successfully.",
          }),
        }
      );
    }
    case "delete": {
      const resumeId = formData.get("id") as string;

      console.log(resumeId);

      const existsresume = await db.resume.findUnique({
        where: {
          id: resumeId,
        },
      });

      if (!existsresume) {
        const toastHeaders = await createToastHeaders({
          type: "error",
          title: "Whoops!",
          description: "Resume not available to delete.",
        });

        return json(
          {
            success: false,
          },
          {
            headers: toastHeaders,
          }
        );
      }

      await db.resume.delete({
        where: {
          id: resumeId,
        },
      });

      return json(
        {
          success: true,
        },
        {
          headers: await createToastHeaders({
            type: "success",
            title: "Success!",
            description: "Resume deleted successfully.",
          }),
        }
      );
    }

    default: {
      return null;
    }
  }
}

export default function Main() {
  const data = useLoaderData<typeof loader>();
  const user = data.user;

  const actiondata = useActionData<typeof action>();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (actiondata?.success) {
      setOpen(false);
    }
  }, [actiondata]);

  const submit = useSubmit();

  return (
    <div className="p-10 ">
      <div className="flex  items-center justify-between w-10/12 m-auto">
        <h2 className="text-4xl tracking-tighter font-bold  "> Resumes</h2>
        <div>
          <DropdownMenu onOpenChange={() => {}}>
            <DropdownMenuTrigger>
              <Avatar className="border-[1px]">
                {user.avatar_url && (
                  <AvatarImage
                    className="object-cover object-center"
                    src={"/resources/img/user/" + user.id}
                  />
                )}
                <AvatarFallback>
                  {String(user.name?.split(" ")).split("")[0].toUpperCase()}
                  {String(user.name?.split(" ")[1]).split("")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              {/* <logout.Form method="post" action="/logout"> */}
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  submit("/logout", { method: "post" });
                }}
              >
                <input type="text" hidden name="_intent" value="logout" />
                <button className="w-full text-left" type="submit">
                  Logout
                </button>
              </DropdownMenuItem>
              {/* </logout.Form> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator className="h-[3rem]" />

      {/* [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]  */}
      <div className="box flex flex-wrap gap-5 gap-y-10">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-[300px]  aspect-square" variant="outline">
              <div className="flex flex-col items-center">
                <PlusIcon />
                Add a resume
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            {/* form  */}

            <ValidatedForm
              resetAfterSubmit
              id="createResume"
              validator={clientValidator}
              method="post"
            >
              <DialogHeader>
                <DialogTitle>Create a resume</DialogTitle>
                <DialogDescription>
                  Make the resume, with the best AI and more with the best.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex  flex-col gap-2">
                  <FieldInput
                    placeholder="Give your resume a name i.e. (Job Resume)"
                    id="name"
                    label="Resume Name"
                    name="name"
                    className="col-span-3"
                  />
                  <input type="text" hidden name="_intent" value="create" />
                  <div className=" flex items-center space-x-4 rounded-md border p-4">
                    <FolderOpen strokeWidth={1.25} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Public Resume
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Others able to view your
                      </p>
                    </div>
                    <Switch name="publicResume" defaultChecked />
                  </div>
                  <div className=" flex items-center space-x-4 rounded-md border p-4">
                    <LayoutTemplate strokeWidth={1.5} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Template
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Your resume will be added to template.
                      </p>
                    </div>
                    <FieldSwitch name="templateResume" defaultChecked={false} />
                  </div>
                </div>

                {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" value="@peduarte" className="col-span-3" />
              </div> */}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <SubmitButton onClick={() => {}} label="Create Resume" />
                </DialogClose>
              </DialogFooter>
            </ValidatedForm>
          </DialogContent>
        </Dialog>
        {data.resumeofuser &&
          data.resumeofuser.map((resume) => {
            return (
              <ResumeCard key={resume.id} resume={resume as any as Resume} />
            );
          })}
      </div>
    </div>
  );
}

export function ResumeCard({ resume }: { resume: Resume }) {
  const location = useLocation();
  const data = useLoaderData<typeof loader>();
  const url = location.pathname;

  console.log(url);
  // const searchQuery = new URLSearchParams(location.search).get("q");

  return (
    <div className="flex hover:shadow-sm overflow-hidden flex-col  h-[300px] aspect-square border-[1px] rounded-md">
      <Link
        to={`/${resume.id}/resume`}
        className="top h-1/2 bg-black/90 dark:bg-white/10 text-white  w-full grid place-content-center"
      >
        <h1 className="text capitalize text-xl  tracking-tighter">
          {resume.name}
        </h1>
      </Link>
      <div className="bottom flex flex-col h-full items-start p-5">
        <h1 className="capitalize text-lg">{resume.name}</h1>
        <p className="previewlink text-[15px] text-purple-500 font-bold tracking-tight">
          <a
            href={`/r/${resume.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`${data.hosturl}/r/${resume.slug}`}
          </a>
        </p>

        <p className="text-[14px] text-muted-foreground">
          Updated about {moment(resume.updatedAt).fromNow()}
        </p>
        <p className="py-1 text-[18px]">
          <span className="text-[16px] lowercase mt-auto tracking-wider">
            <span className="font-semibold">{resume.resumetype}</span> Resume
          </span>
        </p>
        <div className="flex gap-2 mt-auto">
          <Badge variant="outline">
            {resume.public ? "Public" : "Private"}
          </Badge>
          {resume.template && <Badge variant="default">Template</Badge>}
        </div>

        <div className="button self-end">
          <Delete item={resume} />
        </div>
      </div>
    </div>
  );
}
