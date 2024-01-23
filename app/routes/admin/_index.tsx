import { ModeToggle } from "@/components/common/mode-toggler";
import { Button } from "@/components/ui/button";
import { verifyUser } from "@/utils/auth.utils.server";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const admin = await verifyUser(request, "SUPERADMIN");

  return json({ admin });
}

export default function Index() {
  const { admin } = useLoaderData<typeof loader>();

  return (
    <>
      <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
        <Link className="flex items-center w-full gap-2 text-lg font-semibold ">
          <span>Acme Inc</span>
        </Link>
        <nav className="hidden font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
          <Link className="text-gray-500 dark:text-gray-400" href="#">
            Projects
          </Link>
          <Link className="text-gray-500 dark:text-gray-400" href="#">
            Deployments
          </Link>
          <Link className="font-bold" href="#">
            Analytics
          </Link>
          <Link className="text-gray-500 dark:text-gray-400" href="#">
            Logs
          </Link>
          <Link className="text-gray-500 dark:text-gray-400" href="#">
            Settings
          </Link>
        </nav>
        <div className="flex  items-center w-full gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <Button className="rounded-full ml-auto" size="icon" variant="ghost">
            <img
              alt="Avatar"
              className="rounded-full border"
              height="32"
              src={admin.avatar_url}
              style={{
                aspectRatio: "32/32",
                objectFit: "cover",
              }}
              width="32"
            />
            <span className="sr-only">Toggle user menu</span>
          </Button>
          <ModeToggle />
        </div>
      </header>
      <Outlet context={admin} />
    </>
  );
}
