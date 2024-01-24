import { Button } from "@/components/ui/button";
import { Link, useFetcher, useLocation } from "@remix-run/react";
import moment from "moment";

export const LastUpdatedDate = new Date("01/24/2024").valueOf();

export default function Banner() {
  const fetcher = useFetcher();
  const { pathname, search } = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-transparent backdrop-blur-md dark:bg-black/10 border-t border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
      <div className="flex-1 pr-4">
        <span>
          As of{" "}
          <strong>{moment(LastUpdatedDate).format("MMM Do, YYYY")}</strong>
        </span>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          We updated our cookies to provide you with the best possible
          experience. By continuing to use our site, also updated our terms of
          service and cookie policy.
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          className="text-sm underline text-blue-600 dark:text-blue-400"
          to="/cookie/policy"
        >
          Learn more
        </Link>
        <fetcher.Form method="post" action="/hide-tos-banner">
          <input hidden name="redirectTo" value={pathname + search} readOnly />
          <Button className="text-sm">Accept</Button>
        </fetcher.Form>
      </div>
    </div>
  );
}
