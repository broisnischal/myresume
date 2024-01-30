import { ActionFunctionArgs, json } from "@remix-run/node";
import authenticator from "../utils/auth.server";

export async function loader() {
  return json("Not Allowed", {
    status: 403,
    statusText: "Not Allowed",
  });
}

export async function action({ request }: ActionFunctionArgs) {
  console.log("here");

  return await authenticator.logout(request, {
    redirectTo: "/",
  });
}
