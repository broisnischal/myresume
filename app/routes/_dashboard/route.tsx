import { retriveUser } from "@/utils/auth.utils.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = retriveUser(request);

  return user;
}

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();

  console.log(data);

  return (
    <>
      <h1>Your Profile</h1>

      <Outlet />
    </>
  );
}
