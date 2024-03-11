import { ContributionBox } from "@/components/pages/contribution";
import { db } from "@/db/db.server";
import { retriveUser } from "@/utils/auth.utils.server";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useRouteError } from "@remix-run/react";
import axios from "axios";

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const slug = params.id;

  const resume = await db.resume.findUnique({
    where: {
      slug,
    },
    select: {
      user: true,
    },
  });

  if (!resume) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  console.log(resume);

  type Level = 0 | 1 | 2 | 3 | 4;

  const data = await axios.get<{
    total: {
      lastYear: number;
      thisYear: number;
    };
    contributions: {
      date: string;
      count: number;
      level: Level;
    }[];
  }>(
    `https://github-contributions-api.jogruber.de/v4/${resume.user.github_username}?y=last`
  );

  return json({
    username: resume.user.github_username,
    total: data.data.total,
    contributions: data.data.contributions,
    resume,
  });
}

export default function Resume() {
  const { user, contributions, username, total } =
    useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <div className="container  w-fit flex flex-col gap-2 ">
        <div className="flex">
          {/* <div className="txt [&>h4]:text-[12px] flex  items-start flex-col justify-evenly">
            <h4>Mon</h4>
            <h4>Wed</h4>
            <h4>Fri</h4>
          </div> */}
          <div className="p-2 grid grid-rows-[repeat(7,1fr)] gap-[2px] grid-flow-col place-self-center place-content-center w-fit relative">
            {contributions.map((item, index) => (
              <ContributionBox item={item} key={index} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h3>@{username} on GitHub</h3>
          <h5>{total.lastYear} contributions in the last year</h5>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (error.status == 404) {
    return <div>Resume not found</div>;
  }

  return <div>error</div>;
}
