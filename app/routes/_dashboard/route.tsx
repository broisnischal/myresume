import { retriveUser } from "@/utils/auth.utils.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";

import navigation from "./navigation.json";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = retriveUser(request);

  return user;
}

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();

  console.log(data);

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
      {/* <h1>My Resume</h1> */}

      <div className="flex w-full gap-4 py-5 items-center justify-center">
        {navigation.map((item, index) => {
          return (
            <div key={index}>
              <NavLink
                className={({ isActive }) => {
                  const className =
                    "px-5 grid place-content-center min-h-[30px] py-1 text-[14px] capitalize";
                  return isActive
                    ? "bg-[#3d3d3d61] text-white  rounded-full  " + className
                    : "text-gray-500 " + className;
                }}
                to={`/resume/${item.link}`}
              >
                {item.name}
              </NavLink>
            </div>
          );
        })}
      </div>

      <button onClick={showNotification}>Show Notification</button>

      <Outlet />
    </>
  );
}
