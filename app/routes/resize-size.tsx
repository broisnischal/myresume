import { resizeCookie } from "@/cookie.server";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";

export async function loader() {
  return json("Not Allowed", {
    status: 403,
    statusText: "Not Allowed",
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formdata = await request.formData();

  const size = formdata.get("size") ?? 0;

  const redirectTo = formdata.get("redirectTo");

  return redirect(typeof redirectTo === "string" ? redirectTo : "/main", {
    headers: {
      "Set-Cookie": await resizeCookie.serialize({
        size,
      }),
    },
  });
}
