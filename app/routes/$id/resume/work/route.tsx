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
import moment from "moment";

const exSchema = z.object({
  name: zfd.text(
    z
      .string({
        required_error: "Field is required",
      })
      .min(1, {
        message: "Field is required",
      })
  ),
  location: zfd.text(z.string().optional()),
  where: zfd.text(
    z
      .string({
        required_error: " Please fill the form",
      })
      .min(1, {
        message: " Where is required",
      })
  ),
  desc: zfd.text(
    z
      .string({
        required_error: "Description is required",
      })
      .min(1, {
        message: "Description is required",
      })
  ),
  startDate: zfd.text(
    z
      .string({
        required_error: "Start Date is required",
      })
      .min(1, {
        message: "Start Date is required",
      })
  ),
  endDate: zfd.text(
    z
      .string({
        required_error: "End Date is required",
      })
      .min(1, {
        message: "End Date is required",
      })
  ),
  type: zfd.text(z.enum(["work", "education"])),
  id: zfd.text(z.string()),
  // resumeId: z.string().min(1),
});

const edSchema = z.object({
  title: zfd.text(
    z.string({
      required_error: "Degree is Required",
    })
  ),
  field: zfd.text(z.string()),
  where: zfd.text(
    z
      .string({
        required_error: " Please fill the form",
      })
      .min(1, {
        message: " Where is required",
      })
  ),
  desc: zfd.text(
    z
      .string({
        required_error: "Description is required",
      })
      .min(1, {
        message: "Description is required",
      })
  ),
  startDate: zfd.text(
    z
      .string({
        required_error: "Start Date is required",
      })
      .min(1, {
        message: "Start Date is required",
      })
  ),
  endDate: zfd.text(
    z
      .string({
        required_error: "End Date is required",
      })
      .min(1, {
        message: "End Date is required",
      })
  ),
  type: zfd.text(z.enum(["work", "education"])),
  id: zfd.text(z.string()),
  // resumeId: z.string().min(1),
});

type Entry = z.infer<typeof exSchema>;

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;
  const experience = await db.experience.findMany({
    where: {
      resumeId: id,
    },
    orderBy: {
      endDate: "desc",
    },
  });
  const education = await db.education.findMany({
    where: {
      resumeId: id,
    },
    orderBy: {
      endDate: "desc",
    },
  });

  return json({ experience, education });
}

const exClientValidator = withZod(exSchema);
const edClientValidator = withZod(edSchema);

export async function action({ request }: ActionFunctionArgs) {
  const user = await retriveUser(request);

  const formData = await request.formData();

  const intent = formData.get("_intent");
  let type = formData.get("type");

  switch (intent) {
    case "create": {
      if (type === "education") {
        const serverValidator = withZod(edSchema);

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

        const { id, desc, endDate, startDate, where } = result.data;

        const newEducation = await db.education.create({
          data: {
            title: result.data.title,
            field: result.data.field,
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
        const serverValidator = withZod(exSchema);

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

        const { id, desc, endDate, name, startDate, where, location } =
          result.data;

        const newExperience = await db.experience.create({
          data: {
            title: name,
            company: where,
            location: location,
            desc,
            startDate: startDate,
            endDate: endDate,
            resumeId: id,
          },
        });

        return json(
          {
            success: true,
            newExperience,
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

  let { experience, education } = useLoaderData<typeof loader>();

  // const fetcher = useFetcher();

  let fetchers = useFetchers();

  const values = fetchers.reduce<Entry[]>((memo, f) => {
    if (f.formData) {
      let data = Object.fromEntries(f.formData) as Entry;
      memo.push({ ...data, id: 98798 });
    }

    return memo;
  }, []);

  experience = [...experience, ...values];

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
                validator={exClientValidator}
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
                      id="where"
                      name="where"
                      placeholder="Google"
                    />
                    <FieldInput
                      label="Position"
                      id="name"
                      name="name"
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
                  <input hidden name="type" value="work" readOnly />
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
            <div className="flex items-center justify-center w-[50%] h-full">
              <div className="flex justify-center items-center flex-col w-[800px] ">
                {Array.from(experience).map((item, index) => (
                  <div key={index} className="flex space-x-8 items-start ">
                    <div className="text-gray-500 dark:text-gray-400 w-[150px] mt-2">
                      {moment(item.startDate).format("MMM YYYY")} -{" "}
                      {new Date(item.endDate).valueOf() > new Date().valueOf()
                        ? "Present"
                        : moment(item.endDate).format("MMM YYYY")}
                    </div>
                    <div className="flex-1 border-l-2 border-black/80 py-4 dark:border-black relative w-[250px] pl-4">
                      <div className="absolute left-[-34px] rounded-full h-[14px] bg-white border-2 grid place-content-center w-[14px] lg:left-[-7px]">
                        <div className="h-[10px] w-[10px] rounded-full border  bg-gray-900" />
                      </div>
                      <h4 className="text-lg font-bold">{item.title}</h4>
                      <p className="text-gray-500 dark:text-gray-400">
                        {item.company}
                      </p>
                      <p className="mt-2 text-sm max-w-[200px]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent tabIndex={-1} value="education">
          <div className="flex">
            <div className="w-1/2">
              <ValidatedForm
                method="post"
                id="ed-form"
                resetAfterSubmit
                validator={edClientValidator}
              >
                <CardHeader>
                  <CardTitle className="text-2xl">Add your Education</CardTitle>
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
                      id="title"
                      name="title"
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
                  <input hidden name="type" value="education" readOnly />

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

            <div className="flex flex-col gap-4 w-1/2">
              {Array.from(education).map((item, index) => (
                <Card key={item.id} className="min-w-full">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.desc}</CardDescription>
                    <strong className="text-[14px]">
                      {item.institute} | Special in {item.field}
                    </strong>

                    <p>
                      from{" "}
                      <strong>
                        {moment(item.startDate).format("MMM YYYY")}
                      </strong>{" "}
                      to{" "}
                      <strong>{moment(item.endDate).format("MMM YYYY")}</strong>
                    </p>
                  </CardHeader>
                  {/* <CardContent></CardContent> */}
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
