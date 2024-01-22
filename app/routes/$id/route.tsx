import { retriveUser } from "@/utils/auth.utils.server";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  NavLink,
  Outlet,
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
import { useState } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await retriveUser(request);

  return json({
    user,
  });
}

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();

  const { id } = useParams();

  console.log(data);

  const submit = useSubmit();

  const user: User = data.user;

  console.log(user);

  return (
    <>
      <div className="flex">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full min-h-screen rounded-lg border"
        >
          <ResizablePanel defaultSize={0}>
            <div className="flex h-[200px] items-center justify-center p-6">
              <span className="font-semibold">Preview of your resume</span>
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
      <div className="fixed bottom-0 w-full flex py-2 mt-auto  items-center justify-center place-content-center   gap-4 ">
        <div className="my-auto border-2 border-primary/10 w-fit flex dark:backdrop-blur-3xl dark:bg-black/50 backdrop-blur-2xl bg-transparent items-center justify-center px-4 py-2 gap-2 rounded-full">
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
          <div>
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
