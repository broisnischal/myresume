import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db/db.server";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  useActionData,
  useFetcher,
  useFetchers,
  useLoaderData,
  useParams,
  useSubmit,
} from "@remix-run/react";
import { Plus } from "lucide-react";
import { z } from "zod";
import DatePicker from "@/components/common/datepicker";
import { withZod } from "@remix-validated-form/with-zod";
import { retriveUser } from "@/utils/auth.utils.server";
import { createToastHeaders } from "@/utils/toast.server";
import { ValidatedForm, useIsValid } from "remix-validated-form";
import FieldInput from "@/factory/FieldInput";
import { SubmitButton } from "@/factory/SubmitButton";
import { zfd } from "zod-form-data";
import { ScrollArea } from "@/components/ui/scroll-area";

const schema = z.object({
  name: zfd.text(
    z
      .string({
        required_error: "Name is required",
      })
      .min(1, {
        message: "Name is required",
      })
  ),
  where: zfd.text(
    z.string().min(1, {
      message: " Where is required",
    })
  ),
  desc: zfd.text(
    z.string().min(1, {
      message: "Description is required",
    })
  ),
  startDate: zfd.text(
    z.string().min(1, {
      message: "Start Date is required",
    })
  ),
  endDate: zfd.text(
    z.string().min(1, {
      message: "End Date is required",
    })
  ),
  type: zfd.text(z.enum(["work", "education"])),
  id: zfd.text(z.string()),
  // resumeId: z.string().min(1),
});

type Entry = z.infer<typeof schema>;

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;
  const works = await db.works.findMany({
    where: {
      resumeId: id,
    },
  });

  return json({ works });
}

const clientValidator = withZod(schema);

export async function action({ request }: ActionFunctionArgs) {
  const user = await retriveUser(request);

  const formData = await request.formData();

  const intent = formData.get("_intent");

  switch (intent) {
    case "create": {
      const serverValidator = withZod(schema);

      const result = await serverValidator.validate(formData);

      if (result.error) {
        // const toastHeaders = await createToastHeaders({
        //   type: "error",
        //   title: "Whoops!",
        //   description: "Resume name is not available.",
        // });
        return json(
          {
            result,
          },
          {
            // headers: toastHeaders,
          }
        );
      }

      const { id, desc, endDate, name, startDate, type, where } = result.data;

      if (type === "education") {
        const newEducation = await db.education.create({
          data: {
            title: name,
            institute: where,
            desc,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            resumeId: id as string,
          },
        });

        return json(
          {
            success: true,
            newEducation,
          },
          {
            headers: await createToastHeaders({
              type: "success",
              title: "Success!",
              description: "Education created successfully.",
            }),
          }
        );
      } else if (type === "work") {
        const newEducation = await db.works.create({
          data: {
            title: name,
            company: where,
            desc,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            resumeId: id,
          },
        });

        return json(
          {
            success: true,
            newEducation,
          },
          {
            headers: await createToastHeaders({
              type: "success",
              title: "Success!",
              description: "Works created successfully.",
            }),
          }
        );
      } else {
        return json(
          {
            success: false,
          },
          {
            headers: await createToastHeaders({
              type: "error",
              title: "Whoops!",
              description: "Type is invalid.",
            }),
          }
        );
      }
    }
    case "delete": {
      const resumeId = formData.get("id") as string;

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

      // let resume = await db.resume.delete({
      //   where: {
      //     id: resumeId,
      //   },
      // });

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

export const meta: MetaFunction = ({ location }) => {
  // const searchQuery = new URLSearchParams(location.search).get("q");
  return [{ title: `Add work, education` }];
};

export default function LinkPage() {
  let submit = useSubmit();
  const params = useParams();

  // const isclienterror

  const data = useActionData<typeof action>();

  console.log(data);

  const resumeId = params.id;

  let { works } = useLoaderData<typeof loader>();

  // const fetcher = useFetcher();

  let fetchers = useFetchers();

  const values = fetchers.reduce<Entry[]>((memo, f) => {
    if (f.formData) {
      let data = Object.fromEntries(f.formData) as Entry;
      memo.push({ ...data, id: 98798 });
    }

    return memo;
  }, []);

  works = [...works, ...values];

  const project = {
    starred: true,
    name: "Project name",
  };

  // const starred = fetcher.formData
  //   ? // use to optimistic value if submitting
  //     fetcher.formData.get("starred") === "1"
  //   : // fall back to the database state
  //     project.starred;

  return (
    <div>
      {/* <fetcher.Form method="post">
        <button
          type="submit"
          name="starred"
          // use optimistic value to allow interruptions
          value={starred ? "0" : "1"}
        >
          {starred ? "☆" : "★"}
        </button>
      </fetcher.Form> */}

      <Tabs defaultValue="experience" className="">
        <TabsList>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>
        <TabsContent tabIndex={-1} value="experience">
          <div className="flex">
            <div className="w-1/2">
              <ValidatedForm
                method="post"
                id="work-form"
                resetAfterSubmit
                validator={clientValidator}
              >
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Add your Experience
                  </CardTitle>
                  <CardDescription>
                    Add your Experience and education to your resume
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-2">
                    <FieldInput
                      label="Company Name"
                      id="name"
                      name="name"
                      placeholder="Google"
                    />
                    <FieldInput
                      label="Position"
                      id="where"
                      name="where"
                      placeholder="Sr. DevOps Engineer"
                    />
                  </div>
                  <div className="flex  gap-2">
                    <div className="grid gap-2 w-full">
                      <FieldInput
                        label="Start Date"
                        id="startDate"
                        name="startDate"
                        type="date"
                      />
                    </div>
                    <div className="grid gap-2 w-full">
                      <FieldInput
                        label="End date"
                        id="endDate"
                        name="endDate"
                        type="date"
                      />
                    </div>
                    {/* <div className="grid gap-2 h-min w-fit">
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" defaultValue="work">
                      <SelectTrigger id="Select">
                        <SelectValue placeholder="Choose Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
                  </div>
                  <input type="text" hidden name="_intent" value={"create"} />
                  <input type="text" hidden name="id" value={resumeId} />
                  <FieldInput
                    type="textarea"
                    id="desc"
                    label="Description"
                    name="desc"
                    placeholder="Please elaborate your experience."
                  />
                </CardContent>
                <CardFooter className=" space-x-2">
                  <Button variant="outline" type="button">
                    Clear
                  </Button>
                  <SubmitButton label="Add Experience" />
                </CardFooter>
              </ValidatedForm>
            </div>
            <div className="flex items-center justify-center w-1/2 ">
              <div className="flex justify-center flex-col ">
                {Array.from({ length: 5 }).map((item, index) => (
                  <div key={index} className="flex space-x-8 ">
                    <div className="text-gray-500 dark:text-gray-400">
                      Jan 2024 - Present
                    </div>
                    <div className="flex-1 border-l-2 border-gray-200 py-4 dark:border-gray-800 relative pl-4">
                      {/* <div className="absolute -left-2.5 top-0 bg-gray-200 dark:bg-gray-800 rounded-full h-3 w-3" /> */}
                      <div className="absolute left-[-34px] rounded-full  lg:left-[-7px]">
                        <div className="h-[10px] w-[10px] rounded-full border  bg-gray-900" />
                      </div>
                      <h4 className="text-lg font-bold">Software Engineer</h4>
                      <p className="text-gray-500 dark:text-gray-400">OpenAI</p>
                      <p className="mt-2 text-sm">
                        Working on the GPT-4 project.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* {works.map((item, index) => {
            return (
              <div key={index}>
                <h1>{item.title}</h1>
              </div>
            );
          })} */}
        </TabsContent>
        <TabsContent tabIndex={-1} value="education">
          <div className="w-1/2">
            <ValidatedForm
              method="post"
              id="work-form"
              resetAfterSubmit
              validator={clientValidator}
            >
              <CardHeader>
                <CardTitle className="text-2xl">Add your Education</CardTitle>
                <CardDescription>
                  Add your work and education to your resume
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-2">
                  <FieldInput
                    label="Instution"
                    id="where"
                    name="where"
                    placeholder="Harvard University"
                  />
                  <FieldInput
                    label="Degree"
                    id="name"
                    name="name"
                    placeholder="Master of Science"
                  />
                  <FieldInput
                    label="Field"
                    id="field"
                    name="field"
                    placeholder="Physics"
                  />
                </div>
                <div className="flex  gap-2">
                  <div className="grid gap-2 w-full">
                    <FieldInput
                      label="Start Date"
                      id="startDate"
                      name="startDate"
                      type="date"
                    />
                  </div>
                  <div className="grid gap-2 w-full">
                    <FieldInput
                      label="End date"
                      id="endDate"
                      name="endDate"
                      type="date"
                    />
                  </div>
                  {/* <div className="grid gap-2 h-min w-fit">
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" defaultValue="work">
                      <SelectTrigger id="Select">
                        <SelectValue placeholder="Choose Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
                </div>
                <input type="text" hidden name="_intent" value={"create"} />
                <input type="text" hidden name="id" value={resumeId} />
                <FieldInput
                  type="textarea"
                  id="desc"
                  label="Description"
                  name="desc"
                  placeholder="Elaborate something about your education."
                />
              </CardContent>
              <CardFooter className=" space-x-2">
                <Button variant="outline">Reset</Button>
                <SubmitButton label="Add Education" />
              </CardFooter>
            </ValidatedForm>
          </div>
        </TabsContent>
      </Tabs>

      {/* <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-fit" variant={"outline"}>
            Add Work <Plus size={15} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are your work</AlertDialogTitle>

            <AlertDialogDescription>
              add your work{" "}
              <strong className="text-primary">experience </strong>.
            </AlertDialogDescription>

            <Form method="post" id="add-work" className="flex flex-col gap-4">
              <Input
                // onChange={(e) => setDeleteInput(e.target.value)}
                type="text"
                name="title"
                placeholder="Work Title"
              />
              <Input
                // onChange={(e) => setDeleteInput(e.target.value)}
                type="text"
                name="company"
                placeholder="Company Name"
              />
              <Textarea name="desc" placeholder="Short work description" />
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                placeholder="Start Date"
                type="date"
                name="startDate"
                id="startDate"
                required
              />
              <input
                type="hidden"
                name="resumeId"
                // defaultValue={resumeData.id}
              />
              <Label htmlFor="endDate">End Date</Label>
              <Input placeholder="End Date" type="date" name="endDate" />
            </Form>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Form method="post">
							<input type="hidden" value={item.id} name="id" />
							<Button
								disabled={deleteInput !== `delete ${item.label}`}
								type="submit"
								name="_action"
								value={"delete"}
							>
								{state === "submitting" ? (
									<LoaderIcon size={14} className="animate-spin" />
								) : (
									"Delete"
								)}
							</Button>
						</Form>
            <AlertDialogAction className=" p-0" form="add-skill" id="add-skill">
              <Button
                id="add-work"
                name="_action"
                value={"add-work"}
                form="add-work"
              >
                Save work
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  );
}
