import { redirect } from "@remix-run/node";
import authenticator from "./auth.server";

export async function redirectIfLoggedIn(request: Request, where = "/main") {
  const user = await authenticator.isAuthenticated(request);

  if (user) {
    throw redirect(where);
  }
}
