import authenticator from "@/utils/auth.server";
import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  return authenticator.authenticate("linkedin", request, {
    successRedirect: "/main",
    failureRedirect: "/auth/login",
  });
}
