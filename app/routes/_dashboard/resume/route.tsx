import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useRouteError } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log(request);

  return {};
}

export default function List() {
  return (
    <>
      <h1>list of your resume</h1>
      <Outlet />
    </>
  );
}
export function ErrorBoundary() {
  const error = useRouteError() as Error;
  // When NODE_ENV=production:
  // error.message = "Unexpected Server Error"
  // error.stack = undefined

  return (
    <>
      <h1>Error</h1>
      <p>
        <i>{JSON.stringify(error, null, 2)}</i>
      </p>
    </>
  );
}
