import { Button } from "@/components/ui/button";
import { redirectIfLoggedIn } from "@/utils";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  await redirectIfLoggedIn(request);
  return null;
}

export default function Login() {
  return (
    <section className="flex flex-col items-center max-h-[100%] justify-center min-h-[50vh] px-4 py-8 border-b bg-gray-50/55 dark:bg-black/70">
      <Form action="/auth/github" method="post">
        <Button className="flex items-center space-x-4 py-2" variant="default">
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
          <svg
            className=" w-6 h-6 text-white dark:text-black"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          <span className="font-bold text-[16px] md:text-xs">
            Login with GitHub
          </span>
        </Button>
      </Form>
      <div className="mt-8  text-center">
        <p className="px-8 text-center text-[18px] text-balance max-w-[90%] m-auto text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            to="/terms-condition"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy-policy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
