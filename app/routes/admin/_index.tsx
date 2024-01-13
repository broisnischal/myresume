import { verifyUser } from "@/utils/auth.utils.server";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const admin = await verifyUser(request, "SUPERADMIN");

  return json({ admin });
}

export default function Index() {
  const { admin } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Admin Panel</h1>

      <Outlet context={admin} />
    </>
  );
}
