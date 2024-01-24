import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";
import clsx from "clsx";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";
import { themeSessionResolver } from "./session.server";
import styles from "./tailwind.css";
import sonner from "./sonner.css";
import ProgessBar from "./components/common/progess-bar";
import { Toaster } from "./components/ui/sonner";
import { useToast } from "./utils/toaster";
import { getToast } from "./utils/toast.server";
import { combineHeaders } from "./utils/misc";
import { cssBundleHref } from "@remix-run/css-bundle";
import { tosBannerCookie } from "./cookie.server";
// import sonnerstyle from "sonner";

export const links: LinksFunction = () => [
  {
    href: styles,
    rel: "stylesheet",
  },
  {
    href: sonner,
    rel: "stylesheet",
  },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);

  const { toast, headers: toastHeaders } = await getToast(request);

  return json(
    { toast, theme: getTheme() },
    { headers: combineHeaders(toastHeaders) }
  );
}

// function Toast() {
//   const { toast: toasttt } = useLoaderData<typeof loader>();

//   // const location = useLocation();

//   return toasttt ? (
//     <div className="toast flex items-center justify-center px-5 py-1 gap-4 bg-primary text-secondary rounded-lg">
//       <p>{toasttt.message}</p>
//       <Form method="GET" action={location.pathname}>
//         <button type="submit" className="cursor-pointer ">
//           <X />
//         </button>
//       </Form>
//     </div>
//   ) : null;
// }

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}

export function App() {
  const data = useLoaderData<typeof loader>();
  useToast(data.toast);

  const [theme] = useTheme();

  return (
    // data-color-theme="classic"
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <Toaster position="bottom-right" />
        <ProgessBar />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
