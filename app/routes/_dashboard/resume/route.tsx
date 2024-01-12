import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useRouteError } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  return {};
}

export default function List() {
  return (
    <>
      <h1>List of resumes</h1>
      <Outlet />
    </>
  );
}
export function ErrorBoundary() {
  const error = useRouteError();
  // When NODE_ENV=production:
  // error.message = "Unexpected Server Error"
  // error.stack = undefined

  return (
    <>
      <h1>Error</h1>
      <pre>{JSON.stringify(error.message, null, 2)}</pre>
    </>
  );
}
