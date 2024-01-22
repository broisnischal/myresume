import { ActionFunctionArgs, json, type MetaFunction } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import Features from "@/components/pages/feature";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { parse } from "@conform-to/zod";
import { createToastHeaders } from "@/utils/toast.server";
import { useForm } from "@conform-to/react";
import { db } from "@/db/db.server";
import { useRef } from "react";

// import { Toaster } from "sonner";

export const meta: MetaFunction = () => {
  return [
    { title: "My Resume" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const subscribeSchema = z.object({
  email: z
    .string({
      required_error: "Please provide your email.",
    })
    .email({
      message: "Please enter a valid email address.",
    }),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const intent = formData.get("_intent");

  switch (intent) {
    case "subscribe": {
      const submission = parse(formData, { schema: subscribeSchema });

      if (!submission.value || submission.intent !== "submit") {
        return json({ submission }, { status: 400 });
      }

      await db.newsLetter.create({
        data: {
          email: submission.value.email,
        },
      });

      const toastHeaders = await createToastHeaders({
        title: "Subscribed!",
        description:
          "Please confirm your email address to complete the subscription.",
      });

      // const data = await resend.emails.send({
      //   from: "onboarding@resend.dev",
      //   to: submission.value.email,
      //   subject: "Hello World",
      //   html: `<p>Confirm your subscription <strong><a href='http://localhost:3000/newsletter/confirm/${user.id}'>Confirm</a></strong>!</p>`,
      // });

      // console.log(data);

      return json(
        {
          submission,
        },
        {
          headers: toastHeaders,
        }
      );
    }
    default:
      break;
  }

  return {
    headers: {},
  };
}

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 dark:bg-black dark:text-zinc-100 ">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 items-center">
            <div className="flex flex-col justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1
                  style={{
                    WebkitBackgroundClip: "text",
                  }}
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r dark:from-white from-black dark:to-gray-500 to-gray-500"
                >
                  Revolutionize Your Resume Creation
                </h1>

                <p className="max-w-[600px] text-black/90 md:text-xl dark:text-zinc-100 mx-auto">
                  Join us and create your beautiful looking resume, search for
                  your matching degination resume and create your own via
                  templating it!
                </p>

                <div className="m-auto flex items-center justify-center">
                  <Link to={"/main"} prefetch="viewport">
                    <div className="group relative overflow-hidden rounded-full dark:bg-white/10 backdrop:blur-2xl bg-black/5 px-3 py-1 duration-300 w-fit border-[1px] hover:border-[#31bdc6] cursor-pointer border-secondary/30">
                      {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                      <svg
                        className="mr-1 inline-block h-4 w-4 fill-[#31bdc6]"
                        viewBox="4 4 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m19.2 36.4-4.75-10.45L4 21.2l10.45-4.75L19.2 6l4.75 10.45L34.4 21.2l-10.45 4.75ZM36.4 42l-2.35-5.25-5.25-2.35 5.25-2.4 2.35-5.2 2.4 5.2 5.2 2.4-5.2 2.35Z" />
                      </svg>
                      <span
                        style={{
                          WebkitBackgroundClip: "text",
                        }}
                        className="select-none bg-gradient-to-r from-[#31bdc6] to-[#3178c6]   bg-clip-text text-transparent duration-300"
                      >
                        Start Building Resume
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
              {/* <Link to={"/main"}>
								<Button variant="default">Start Building Resume</Button>
							</Link> */}
            </div>
          </div>
        </div>
      </section>

      <Features />

      <NewsLetter />
    </div>
  );
}

export function NewsLetter() {
  const newsletter = useFetcher();
  const ref = useRef<HTMLInputElement>(null);

  const isSubmitting = newsletter.formData?.get("_intent") === "subscribe";

  const [form, fields] = useForm({
    id: "user",
    onValidate({ formData }) {
      return parse(formData, { schema: subscribeSchema });
    },
    shouldValidate: "onSubmit",
  });

  return (
    <div className="min-h-[50vh] w-[90vw] m-auto flex flex-col lg:flex-row items-start lg:items-center justify-evenly">
      <div className="flex flex-col gap-3 ">
        <h2 className="text-4xl font-bold">Newsletter</h2>
        <p className="text-balance max-w-[350px]">
          We are working hard to create this among you, all Developers. Stay
          Tuned for the latest releases and features.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <newsletter.Form
          className="flex  items-center justify-center gap-2 dark:bg-black dark:text-zinc-100 "
          method="post"
          {...form.props}
        >
          <Input
            ref={ref}
            className="min-w-[30vw]"
            placeholder="Suscribe to our newsletter"
            {...fields.email}
          />

          <input type="hidden" name="_intent" value="subscribe" />
          <Button disabled={isSubmitting} type="submit" variant="outline">
            {isSubmitting ? "Loading..." : "Subscribe"}
          </Button>
        </newsletter.Form>
        <div className="text-red-400 text-[14px]">{fields.email.error}</div>
      </div>
    </div>
  );
}
