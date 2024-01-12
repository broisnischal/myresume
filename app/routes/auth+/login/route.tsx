import { Button } from "@/components/ui/button";
import { Form } from "@remix-run/react";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Form action="/auth/github" method="post">
        <Button className="flex items-center space-x-4 py-2" variant="outline">
          <svg
            className=" w-6 h-6 text-gray-800 dark:text-gray-100"
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
          <span>Github</span>
        </Button>
      </Form>
    </div>
  );
}
