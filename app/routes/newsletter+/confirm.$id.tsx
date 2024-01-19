import { db } from "@/db/db.server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useRouteError } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;

  const alreadySubscribed = await db.newsLetter.findFirst({
    where: {
      id,
      subscribed: true,
    },
  });

  if (alreadySubscribed) {
    throw new Response("Already subscribed", {
      status: 400,
    });
  }

  const exists = await db.newsLetter.findUnique({
    where: {
      id,
    },
  });

  if (!exists) {
    throw new Response("Not found", {
      status: 404,
    });
  }

  const updated = await db.newsLetter.update({
    where: {
      id: exists.id,
    },
    data: {
      subscribed: true,
    },
  });
  return updated;
}

export default function Confirm() {
  const newsletter = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h2 className="text-2xl">You are confirmed!</h2>
      <p>
        Hey, <i> {newsletter.email}</i>!
        <br />
        <p className="leading-relaxed">
          Thank you for subscribing to our newsletter. You will receive our
          latest updates.
        </p>
        <Link to="/"> Home</Link>
      </p>
      {/* <pre>{JSON.stringify(newsletter, null, 2)}</pre> */}
    </div>
  );
}

export function ErrorBoundary() {
  const error: PrismaClientKnownRequestError & { status?: number | string } =
    useRouteError() as any;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      {error.status == 400 ? (
        <div>
          <p className="max-w-[300px] text-balance">
            <i>
              You have already confirmed your email. You don't need to confirm.
            </i>
          </p>
        </div>
      ) : error.status == 404 ? (
        <div>
          <h2>Something went wrong!</h2>

          <p>
            <i>
              Invalid confirmation link. Please check your email and click on
              the confirmation link.
            </i>
          </p>
        </div>
      ) : (
        <div>
          <p>
            <i>{error.message}</i>
          </p>
        </div>
      )}

      {/* <pre>{JSON.stringify(caught.data, null, 2)}</pre> */}
    </div>
  );
}
