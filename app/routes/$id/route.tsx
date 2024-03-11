import { ModeToggle } from "@/components/common/mode-toggler";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { resizeCookie, tosBannerCookie } from "@/cookie.server";
import { db } from "@/db/db.server";
import { retriveUser } from "@/utils/auth.utils.server";
import { User } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Link,
  NavLink,
  Outlet,
  useActionData,
  useLoaderData,
  useLocation,
  useParams,
  useSubmit,
} from "@remix-run/react";
import { MonitorDot } from "lucide-react";
import Banner, { LastUpdatedDate } from "./cookie-banner";
import navigation from "./resume/navigation";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await retriveUser(request);

  const cookieHeader = request.headers.get("Cookie");

  const cookie = await tosBannerCookie.parse(cookieHeader);
  const sizecookie = await resizeCookie.parse(cookieHeader);

  const resume = await db.resume.findUnique({
    where: {
      id: params.id,
    },
    include: {
      skills: true,
      user: true,
    },
  });

  const svgldata = await fetch("http://localhost:3000/icons.json").then((res) =>
    res.json()
  );

  const headers = new Headers();
  headers.append(
    "set-cookie",
    await tosBannerCookie.serialize({
      dateTOSRead: 0,
    })
  );

  headers.append(
    "set-cookie",
    await resizeCookie.serialize({
      size: 0,
    })
  );

  if (cookie && sizecookie) {
    return json({
      user,
      resume,
      svgldata,
      sizecookie,
      showBanner: cookie.dateTOSRead < LastUpdatedDate,
    });
  }

  return json(
    {
      user,
      resume,
      svgldata,
      showBanner: true,
      sizecookie: { size: 0 },
    },
    {
      headers,
    }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  return null;
}

export default function Dashboard() {
  const submit = useSubmit();

  const {
    user: userr,
    resume,
    showBanner,
    svgldata,
    sizecookie,
  } = useLoaderData<typeof loader>();

  const { pathname, search } = useLocation();

  console.log(sizecookie.size);
  const { id } = useParams();
  const user: User = userr;

  const actiondata = useActionData<typeof action>();

  return (
    <>
      <div className="flex noise">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full min-h-screen rounded-lg border"
        >
          <ResizablePanel
            defaultSize={Number(sizecookie.size)}
            onResize={(size) => {
              submit(
                { size, redirectTo: pathname + search },
                {
                  method: "post",
                  navigate: false,
                  fetcherKey: "resize",
                  action: "/resize-size",
                }
              );
            }}
          >
            <div className=" relative flex flex-col h-[200px] items-center gap-4 justify-center py-6">
              {/* <h1 className="font-semibold">Preview of your resume</h1> */}
              <br />
              <div className="mb-10" />
              <Link
                to={`/r/${resume?.slug}`}
                className="underline text-[14px] px-3 py-1 rounded-lg absolute top-0 left-0"
              >
                Preview Live
              </Link>

              <h1 className="text-6xl text-center font-bold capitalize">
                {resume?.user.name}
              </h1>

              <div className="box bottom-0 w-full">
                <div className="horizontal-scrolling-items text-customOrange font-GilroyHeavy text-[1rem] xsm:text-[3rem] lg:text-[4.5rem] uppercase">
                  <div className="horizontal-scrolling-items__item ">
                    <div className="flex marquee gap-7">
                      {resume?.skills.map((item) => {
                        const val = svgldata.filter(
                          (data) => data.name === item.name
                        )[0];

                        return (
                          <div key={item.id} className="">
                            <div
                              className="w-[100%] rounded-xl group:active:animate-ping place-content-center aspect-square object-fill flex-shrink-0 relative flex items-center border border-transparent bg-gradient-to-br from-white to-black/10 dark:from-white/70 dark:to-white/100 bg-clip-padding-box border-box p-[10px]"
                              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                              dangerouslySetInnerHTML={{
                                __html: val?.svg,
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="horizontal-scrolling-items__item ">
                    <div className="flex marquee gap-7">
                      {resume?.skills.map((item) => {
                        const val = svgldata.filter(
                          (data) => data.name === item.name
                        )[0];

                        return (
                          <div key={item.id} className="">
                            <div
                              className="w-[100%] rounded-xl group:active:animate-ping place-content-center aspect-square object-fill flex-shrink-0 relative flex items-center border border-transparent bg-gradient-to-br from-white to-black/10 dark:from-white/70 dark:to-white/100 bg-clip-padding-box border-box p-[10px]"
                              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                              dangerouslySetInnerHTML={{
                                __html: val?.svg,
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle
            withHandle
            className="bg-transparent relative border-r-[1px]  w-[10px] mr-[1rem]"
          />
          <ResizablePanel>
            <Outlet />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <div className="fixed bottom-0 w-full flex py-2 mt-auto  items-center justify-center place-content-center gap-4 ">
        <div className="my-auto border-[1px] border-primary/10 w-fit flex dark:backdrop-blur-3xl dark:bg-black/50 backdrop-blur-2xl bg-transparent items-center justify-center px-2 py-2 gap-2 rounded-full">
          {navigation.map((item, index) => {
            return (
              <NavLink
                key={index}
                className={({ isActive }) => {
                  const className =
                    "px-5 grid bg-white dark:bg-black/10 aspect-square w-10 h-10 shadow-sm bg-transparent border-[1px] dark:border-white/10 border-black/5 rounded-full place-content-center ";
                  return isActive
                    ? `  ${className}`
                    : `text-gray-400 ${className}`;
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
              return isActive ? `  ${className}` : `text-gray-400 ${className}`;
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
        {showBanner && <Banner />}
      </div>
    </>
  );
}
