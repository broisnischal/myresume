import { IndividualContribution } from "@/components/pages/contribution";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";

export async function loader() {
  const data = await axios.get(
    "https://github-contributions-api.jogruber.de/v4/broisnischal?y=last"
  );

  console.log(data.data);

  return json({ contributions: data.data.contributions });
}

export default function Resume() {
  const { contributions } = useLoaderData<typeof loader>();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-4 rounded-lg grid grid-rows-[repeat(7,1fr)] gap-1 grid-flow-col place-self-center place-content-center w-fit relative ">
        {contributions.map((item, index) => (
          <IndividualContribution item={item} key={index} />
        ))}
      </div>
    </div>
  );
}
