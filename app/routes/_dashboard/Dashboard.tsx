import { Outlet, useLoaderData } from "@remix-run/react";
import Dock from "@/factory/dock/Dock";
import DockItem from "@/factory/dock/DockItem";
import { loader } from "./route";

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();

  const showNotification = () => {
    // Code to request notification permission and show a notification
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("Bruh you clicked notification!", {
          body: "Hi i am broisnees and i am learning to build the web better.",
          icon: "/favicon.ico",
          renotify: true,
          requireInteraction: true,
          tag: "hello-notification",
          image: "/favicon.ico",
          data: {
            url: "https://example.com",
            date: new Date().toLocaleString(),
          },
          vibrate: [100, 50, 100],
        });
      }
    });
  };

  return (
    <>
      <Outlet />
      {/* <div className="fixed bottom-0 w-full flex py-2 mt-auto  items-center justify-center place-content-center   gap-4 ">
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
                      to={`/resume/id1/${item.link}`}
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
              </div>
            </div> */}
      <Dock>
        <DockItem icon="🏠" label="Home" />
        <DockItem icon="📁" label="Files" />
        <DockItem icon="📸" label="Photos" />
        <DockItem icon="🎵" label="Music" />
        {/* Add more items as needed */}
      </Dock>
      {/* <button onClick={showNotification}>Show Notification</button> */}
    </>
  );
}
