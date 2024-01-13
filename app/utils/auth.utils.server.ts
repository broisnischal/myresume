import { redirect } from "@remix-run/node";
import authenticator from "./auth.server";
import type { User, UserType } from "@prisma/client";

export async function retriveUser(request: Request) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });
  return user;
}

export async function verifyUser(
  request: Request,
  type: UserType
): Promise<User> {
  const user = (await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  })) as User;

  if (user.usertype !== type) {
    return redirect("/auth/login") as unknown as User;
  }
  return user;
}
