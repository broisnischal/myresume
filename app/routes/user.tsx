import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createToastHeaders } from "@/utils/toast.server";
import { type ActionFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { Loader, PlusCircle } from "lucide-react";
import { z } from "zod";
import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";

const schema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(2, {
      message: "Name should be minimum 2 character",
    }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Email should be valid",
    }),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = parse(formData, { schema });

  if (!submission.value || submission.intent !== "submit") {
    return json({ submission }, { status: 400 });
  }

  //   return redirectWithToast("/profile", {
  //     title: "User created",
  //     description: "User created successfully",
  //     type: "success",
  //   });

  const toastHeaders = await createToastHeaders({
    title: "Deleted",
    description: "Your connection has been deleted.",
  });

  return json(
    {
      submission,
    },
    {
      headers: toastHeaders,
    }
  );

  //   return redirectWithToast("/profile", {
  //     title: "User created",
  //     description: "User created successfully",
  //     type: "success",
  //   });
}

export default function User() {
  const navigation = useNavigation();
  const lastSubmission = useActionData<typeof action>();
  console.log(lastSubmission);

  const [form, fields] = useForm({
    id: "user",
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
    shouldValidate: "onBlur",
  });

  return (
    <div>
      <Link to={"/profile"}>Profile</Link>
      <h2>User</h2>

      <Form
        method="post"
        className="w-1/3 p-10 flex flex-col gap-3"
        {...form.props}
      >
        <Input
          {...conform.input(fields.name)}
          type="text"
          name="name"
          placeholder="Enter your name"
        />
        <div>{fields.name.error}</div>
        <Input
          {...conform.input(fields.email)}
          type="email"
          name="email"
          placeholder="Enter your email"
        />
        <div>{fields.email.error}</div>

        <Button
          type="submit"
          variant={"outline"}
          size={"sm"}
          className="flex gap-3"
        >
          {navigation.state === "submitting" ? (
            <Loader className="animate-spin" size={15} />
          ) : (
            <PlusCircle size={15} />
          )}{" "}
          <span>Create User</span>
        </Button>
      </Form>
    </div>
  );
}
