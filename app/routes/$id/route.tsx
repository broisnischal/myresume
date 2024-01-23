import { retriveUser } from "@/utils/auth.utils.server";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  createCookie,
  json,
} from "@remix-run/node";
import {
  NavLink,
  Outlet,
  useActionData,
  useFetcher,
  useLoaderData,
  useParams,
  useSubmit,
} from "@remix-run/react";
import navigation from "./resume/navigation";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "@/components/common/mode-toggler";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MonitorDot } from "lucide-react";
import { db } from "@/db/db.server";
import { useEffect, useState } from "react";
import { cookie } from "@/session.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await retriveUser(request);

  const resume = await db.resume.findUnique({
    where: {
      id: params.id,
    },
  });

  const cookiedata = await cookie.parse(request.headers.get("cookie"));

  console.log(cookiedata);

  console.log("asdf");

  const defaultsize = 50;

  return json(
    {
      user,
      resume,
      defaultsize: cookiedata.defaultValue?.defaultsize || defaultsize,
    },
    {
      headers: {
        "Set-Cookie": await cookie.serialize({
          defaultsize: cookiedata.defaultValue?.defaultsize || defaultsize,
        }),
      },
    }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  // const defaultValue = await cookie.parse(request.headers.get("cookie"));

  // const defaultsize = request.headers.get("defaultsize");

  const formdata = await request.formData();

  const size = formdata.get("size");

  console.log(size);

  const serializedCookie = await cookie.serialize({
    defaultsize: size,
  });

  console.log(serializedCookie);

  return json(
    {},
    {
      headers: {
        "Set-Cookie": serializedCookie,
      },
    }
  );
}

export default function Dashboard() {
  const { user: userr, resume } = useLoaderData<typeof loader>();

  const actiondata = useActionData<typeof action>();

  console.log(actiondata);

  console.log();

  let defaultsize;

  const { id } = useParams();

  const submit = useSubmit();

  const user: User = userr;

  // const [defaultsize, setDefaultSize] = useState(
  //   typeof window !== "undefined" && localStorage.getItem("defaultsize")
  // );

  // useEffect(() => {
  //   // const def = localStorage.getItem("defaultsize");

  //   // if (def) {
  //   //   setDefaultSize(JSON.parse(def));
  //   // }

  //   localStorage.setItem("defaultsize", JSON.stringify(defaultsize || 0));
  // }, [defaultsize]);

  return (
    <>
      <div className="flex">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full min-h-screen rounded-lg border"
        >
          <ResizablePanel
            defaultSize={Number(0)}
            onResize={(size) => {
              submit({ size }, { method: "post", navigate: false });
              // setDefaultSize(size);
            }}
          >
            <div className="flex flex-col h-[200px] items-center justify-center p-6">
              <h1 className="font-semibold">Preview of your resume</h1>
              <br />
              <h1>{resume?.name}</h1>
            </div>
          </ResizablePanel>
          <ResizableHandle
            withHandle
            className="bg-transparent relative border-r-[1px]  w-[10px] mr-[1rem]"
          ></ResizableHandle>
          <ResizablePanel>
            <Outlet />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <div className="fixed bottom-0 w-full flex py-2 mt-auto  items-center justify-center place-content-center gap-4 ">
        <div className="my-auto border-[1px] border-primary/10 w-fit flex dark:backdrop-blur-3xl dark:bg-black/50 backdrop-blur-2xl bg-transparent items-center justify-center px-2 py-2 gap-2 rounded-full">
          <ModeToggle />
          {navigation.map((item, index) => {
            return (
              <NavLink
                key={index}
                className={({ isActive }) => {
                  const className =
                    "px-5 grid bg-white dark:bg-black/10 aspect-square w-10 h-10 shadow-sm bg-transparent border-[1px] dark:border-white/10 border-black/5 rounded-full place-content-center ";
                  return isActive
                    ? "  " + className
                    : "text-gray-400 " + className;
                }}
                to={`/${id}/resume/${item.link}`}
                prefetch="intent"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>{item.icon}</TooltipTrigger>
                    <TooltipContent>
                      <p className="capitalize">{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </NavLink>
            );
          })}
          <NavLink
            className={({ isActive }) => {
              const className =
                "px-5 grid bg-white dark:bg-black/10 aspect-square w-10 h-10 shadow-sm bg-transparent border-[1px] dark:border-white/10 border-black/5 rounded-full place-content-center ";
              return isActive ? "  " + className : "text-gray-400 " + className;
            }}
            to={`/main`}
            prefetch="intent"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <MonitorDot size={20} />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="capitalize">Main</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </NavLink>
          <div className="grid place-content-center">
            <DropdownMenu onOpenChange={() => {}}>
              <DropdownMenuTrigger>
                <Avatar className="border-[1px]">
                  {user.avatar_url && <AvatarImage src={user.avatar_url} />}
                  <AvatarFallback>
                    {String(user.name?.split(" ")).split("")[0].toUpperCase()}
                    {String(user.name?.split(" ")[1])
                      .split("")[0]
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
                {/* <logout.Form method="post" action="/logout"> */}
                <DropdownMenuItem
                  onClick={() => submit("/logout", { method: "post" })}
                >
                  <input type="text" hidden name="_intent" value="logout" />
                  <button className="w-full text-left" type="submit">
                    Logout
                  </button>
                </DropdownMenuItem>
                {/* </logout.Form> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}
