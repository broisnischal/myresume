import { ContributionBox } from "@/components/pages/contribution";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";

export async function loader() {
  let username = "broisnischal";

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
  }>(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);

  return json({
    username,
    total: data.data.total,
    contributions: data.data.contributions,
  });
}

export default function Resume() {
  const { contributions, username, total } = useLoaderData<typeof loader>();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="container w-fit flex flex-col gap-2 ">
        <div className="flex">
          <div className="txt [&>h4]:text-[13px] flex flex-col justify-evenly items-center">
            <h4>Mon</h4>
            <h4>Wed</h4>
            <h4>Fri</h4>
          </div>
          <div className="p-2 grid grid-rows-[repeat(7,1fr)] gap-1 grid-flow-col place-self-center place-content-center w-fit relative">
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
