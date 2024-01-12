import authenticator from "@/utils/auth.server";
import { ActionFunctionArgs, redirect } from "@remix-run/node";

export const loader = () => redirect("/auth/login");

export async function action({ request }: ActionFunctionArgs) {
  return authenticator.authenticate("github", request, {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  });
}
