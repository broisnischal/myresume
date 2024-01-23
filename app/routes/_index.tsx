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
import { ArrowRightIcon, FacebookIcon } from "lucide-react";
import { ModeToggle } from "@/components/common/mode-toggler";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
      {/* main  */}

      <section className="w-full grid place-content-center min-h-[50vh] py-20 md:py-24  lg:py-32 xl:py-48  dark:text-zinc-100 ">
        <div className="container  px-4 md:px-6  ">
          <div className="grid gap-6 items-center">
            <div className="flex flex-col  justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Announcement />
                <h1
                  style={{
                    WebkitBackgroundClip: "text",
                  }}
                  className="text-6xl font-bold tracking-tighter none bg-clip-text text-transparent bg-gradient-to-r dark:from-white from-black dark:to-gray-500 to-gray-500"
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
                    <div className="group relative overflow-hidden rounded-full text-[18px] dark:bg-white/10 backdrop:blur-2xl bg-black/5 px-3 py-1 duration-300 w-fit border-[1px]  lg:hover:border-[#31bdc6] border-[#31bdc6] lg:border-transparent  cursor-pointer border-secondary/30">
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
                  <ModeToggle />
                </div>
              </div>
              {/* <Link to={"/main"}>
								<Button variant="default">Start Building Resume</Button>
							</Link> */}
            </div>
          </div>
        </div>
      </section>
      <Confession />

      <AIStarted />
      <Features />

      <NewsLetter />

      <Footer />
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
    <div className="min-h-[50vh] w-[80vw] m-auto flex flex-col lg:flex-row items-start lg:items-center justify-evenly">
      <div className="flex  flex-col gap-3 ">
        <h2 className="text-4xl font-bold">Newsletter</h2>
        <p className="text-balance max-w-[350px]">
          We are working hard to create this among you, all Developers. Stay
          Tuned for the latest releases and features.
        </p>
      </div>
      <div className="w-full max-w-full lg:max-w-fit ">
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
        <p className="text-xs text-left w-full text-gray-500 dark:text-gray-400">
          Sign up to get notified when we launch.
          <Link className="underline underline-offset-2" to="/terms">
            Terms & Conditions
          </Link>
        </p>
      </div>
    </div>
  );
}

export function AIStarted() {
  return (
    <section className="w-full  py-20 border-t bg-neutral-50 dark:bg-black/80  flex flex-col items-center justify-center">
      <h1 className="lg:leading-tighter text-3xl  font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
        AI Resume Generator
      </h1>
      <p className="mt-4 w-[90%] text-center text-balance text-gray-500 md:text-xl dark:text-gray-400">
        Create professional resumes in minutes with our AI-powered tool and
        Professionals templates.
      </p>
      <Link
        className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300 mt-4"
        to="/main"
      >
        Get Started
      </Link>
    </section>
  );
}

export function Announcement() {
  return (
    <div
      // to="/docs/changelog"
      className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
    >
      🚀
      <Separator className="mx-2 h-4" orientation="vertical" />{" "}
      <span className="sm:hidden">Built for developers.</span>
      <span className="hidden sm:inline">
        Build and released for developers.
      </span>
      {/* <ArrowRightIcon className="ml-1 h-4 w-4" /> */}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="dark flex flex-col gap-4 md:flex-row items-center justify-between px-6 py-4 bg-white dark:bg-black/90 dark:text-white border-t border-t-gray-200 dark:border-t-gray-800 text-secondary">
      <div>
        <p className="text-sm">© 2024 Your Company. All rights reserved.</p>
      </div>

      <nav className="space-x-4 flex flex-row ">
        <Link className="text-sm " to="/contact">
          Contact
        </Link>
        <Link className="text-sm " to="/privacy-policy">
          Privacy Policy
        </Link>
        <Link className="text-sm " to="/cookie/policy">
          Cookie Policy
        </Link>
      </nav>
    </footer>
  );
}

export function Confession() {
  return (
    <div className="flex flex-col min-h-full ">
      <Badge className="w-fit blur-none self-center translate-y-7 m-4">
        Upcoming
      </Badge>
      <main className="flex-1 ">
        {/* <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                Welcome back, Developer!
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Here are your recent activities.
              </p>
            </div>
          </div>
        </section> */}
        <section className="w-full h-fit py-20 md:py-24 blur-[3px] noise lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  Activity
                </div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  You have 10 unread confessions.
                </h2>
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                  to="/"
                >
                  View Messages
                </Link>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="flex gap-2">
                  <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                    Quick Links
                  </div>
                  <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                    Bio
                  </div>
                </div>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                  Here are some quick features to commonly used tools and
                  resources.
                </p>
                <div className="grid w-[min(550px,100%)] grid-cols-2 gap-4">
                  <Link
                    className="group border grid h-auto w-full items-start justify-start gap-1 rounded-md bg-white p-4 text-sm font-medium transition-colors  focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-black"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Testimonials
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Get your testimonials and get the options to add them into
                      your resume.
                    </div>
                  </Link>

                  <Link
                    className="group border grid h-auto w-full items-start justify-start gap-1 rounded-md bg-white p-4 text-sm font-medium transition-colors  focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-black"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Github contribution
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Github Contribution chart is available for your resume.
                    </div>
                  </Link>

                  <Link
                    className="group border grid h-auto w-full items-start justify-start gap-1 rounded-md bg-white p-4 text-sm font-medium transition-colors  focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-black"
                    href="#"
                  >
                    <div className="text-sm font-medium leading-none group-hover:underline">
                      Anonomous Confession
                    </div>
                    <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                      Anonomous Confession is available for your resume.
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
