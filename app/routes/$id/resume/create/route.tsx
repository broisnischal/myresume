import { db } from "@/db/db.server";
import { retriveUser } from "@/utils/auth.utils.server";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import {
  Check,
  CheckCheck,
  CheckCheckIcon,
  CheckCircle2Icon,
  CheckIcon,
  LucideCheckCircle,
} from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await retriveUser(request);

  const svgldata = await fetch("http://localhost:3000/icons.json").then((res) =>
    res.json()
  );

  const skills = await db.skills.findMany({
    where: {
      resume: {
        userId: user.id,
      },
    },
  });

  // const resume = await db.resume.findUnique({
  //   where: {
  //     userId: user.id,
  //   },
  // });

  return json({
    user,
    svgldata,
    skills,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formdata = await request.formData();
  const { id } = params;

  const intent = formdata.get("_intent");

  switch (intent) {
    case "create": {
      const skills = formdata.get("name") as unknown as string;

      const ifalredy = await db.skills.findFirst({
        where: {
          name: skills,
          resumeId: id,
        },
      });

      // remove and toggle

      if (ifalredy) {
        await db.skills.delete({
          where: {
            id: ifalredy?.id,
          },
        });
        break;
      }

      const newskill = await db.skills.create({
        data: {
          name: skills,
          type: "STACKS",
          resumeId: id,
          value: 1,
        },
      });
      // break;

      console.log(newskill);

      return newskill;
    }
  }

  return json({ ok: true });
}

export default function AddSkills() {
  const submit = useSubmit();
  const { svgldata, user, skills } = useLoaderData<typeof loader>();

  console.log(skills);

  return (
    <div className="flex flex-col gap-4 items-center justify-center ">
      <h1 className="text-3xl mb-5 font-bold py-5">Add Skills</h1>

      <div className="flex gap-4 flex-wrap items-center justify-center ">
        {svgldata.map((svgdata, i) => (
          <Form
            key={i}
            onClick={() => {
              submit(
                {
                  _intent: "create",
                  name: String(svgdata.name),
                  svg: svgdata.svg,
                },
                { method: "post", navigate: false }
              );
            }}
            className="flex relative bg-white dark:text-black cursor-pointer group flex-col aspect-square w-[100px] justify-center items-center gap-2 border-[1px] p-4 "
          >
            {/* {svgdata.name == skills[i]?.name && (
              <CheckCheckIcon className="text-green-500 absolute top-2 right-2" />
            )} */}
            {/* {svgdata.name === skills} */}

            {skills.map((skill) => {
              if (skill.name === svgdata.name) {
                return (
                  <LucideCheckCircle
                    key={i}
                    size={15}
                    className=" absolute top-2 right-2 bg-black rounded-full text-white"
                  />
                );
              }
            })}

            {/* {skills[i] && (
              <CheckCheckIcon className="text-green-500 absolute top-2 right-2" />
            )} */}

            {/* {svgdata.name} */}

            {/* {skills[i]} */}
            <div
              className="w-[10%] group:active:animate-ping grid place-content-center aspect-square object-fill "
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
              dangerouslySetInnerHTML={{
                __html: svgdata.svg,
              }}
            />
            {/* {svgdata.file} */}

            <h2 className="font-bold capitalize">{svgdata.name}</h2>
          </Form>
        ))}
      </div>
    </div>
  );
}
