import { CareerItem } from "@/components/common/career-item";
import { ContributionBox } from "@/components/pages/contribution";
import { db } from "@/db/db.server";
import { retriveUser } from "@/utils/auth.utils.server";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useRouteError } from "@remix-run/react";
import axios from "axios";
import { FileTextIcon, Globe, LocateIcon, WholeWord } from "lucide-react";
import { load } from "cheerio";
import { ReactSVG } from "react-svg";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import moment from "moment";

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const slug = params.id;

  const resume = await db.resume.findUnique({
    where: {
      slug,
    },
    include: {
      user: true,
      education: true,
      experience: true,
      projects: true,
      skills: true,
      awards: true,
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
    `https://github-contributions-api.jogruber.de/v4/${resume.user.github_username}?y=last`,
  );

  const response = await axios.get("https://codeium.com/profile/broisnischal");

  // Load the HTML content into cheerio
  const $ = load(response.data);
  const svgContent = $("svg.h-full.w-full").parent().html();

  return json({
    username: resume.user.github_username,
    total: data.data.total,
    contributions: data.data.contributions,
    resume,
    svgContent,
  });
}

export default function Resume() {
  const { user, contributions, username, total, resume, svgContent } =
    useLoaderData<typeof loader>();
  console.log(svgContent);

  return (
    <div className="flex my-[200px]  flex-col  gap-4 items-start justify-center min-h-screen w-[60vw] m-auto">
      <div className="flex items-center">
        <div className="flex gap-4 flex-col flex-1">
          <h1 className="text-5xl font-bold">
            {resume.user.name}{" "}
            <span className="text-2xl capitalize font-semibold">
              &lt; {resume.user.nickname} /&gt;
            </span>
          </h1>
          <p className="max-w-[30rem]">{resume.user.bio}</p>
          <span className="flex gap-2">
            <Globe /> {resume.user.location}
          </span>
        </div>
        <div className="">
          <img
            src={resume.user.avatar_url!}
            className="grayscale w-[150px] aspect-square rounded-lg
        object-cover object-center overflow-hidden border-1 border-slate-300"
            alt=""
          />
        </div>
      </div>
      <div className="about">
        <h1 className="text-xl font-bold">About</h1>
        <br />
        <p>{resume.description}</p>
        <br />
      </div>

      {/* COdeium */}
      <div className="flex flex-col w-full gap-4  items-center justify-center px-20 dark:px-12 bg-black dark:bg-transparent">
        <h1 className="font-bold text-white dark:text-white mt-2">
          Codeium Profile
        </h1>
        <div
          className="w-full "
          dangerouslySetInnerHTML={{ __html: svgContent }}
        ></div>
      </div>

      <hr />

      <h2 className="dark:text-neutral-100 text-neutral-800 flex  gap-x-4 items-center text-2xl font-bold text-balance">
        <FileTextIcon className="size-6 animate-pulse stroke-[1.5]" />
        Career & Works
      </h2>

      <ol className="relative border-s dark:border-neutral-600 border-neutral-400 ml-[11.5px] flex flex-col gap-y-8">
        {resume.experience.map((item, index) => (
          <li key={index} className="ms-[30px]">
            <CareerItem
              title={item.title}
              key={item.id}
              badges={["2", "1"]}
              company={item.company}
              description={item.desc}
              end={item.endDate}
              start={item.startDate}
            />
          </li>
        ))}
      </ol>

      <div className="my-10">
        <h1 className="text-2xl font-bold">Education</h1>
        <br />
        <div className="flex gap-2 flex-wrap">
          {resume.education.map((item, index) => {
            return (
              <>
                <Card className="p-5">
                  <CardContent>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {item.desc}
                    </p>
                    <hr className="my-2" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Graduated: {moment(item.endDate).format("MMM YYYY")}
                    </p>
                  </CardContent>
                </Card>
              </>
            );
          })}
        </div>
      </div>

      <div className="my-10">
        <h1 className="text-2xl font-bold">Skills</h1>
        <br />
        <div className="flex gap-3 flex-wrap">
          {resume.skills.map((item, index) => {
            return (
              <>
                <Badge variant={"secondary"}>{item.name}</Badge>
              </>
            );
          })}
        </div>
      </div>

      <div className="my-5">
        <h1 className="text-2xl font-bold">Awards</h1>

        {resume.awards.map((item, index) => {
          return <div key={index}>{item.title}</div>;
        })}
      </div>

      {resume.projects.map((item, index) => {
        return <div key={index}>{item.title}</div>;
      })}

      <div className="flex flex-col w-fit m-auto   items-center justify-center">
        <br />
        <div className="flex mt-2">
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
        <div className="flex w-full justify-between">
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
