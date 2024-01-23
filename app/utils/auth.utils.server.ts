import { redirect } from "@remix-run/node";
import authenticator from "./auth.server";
import type { User, UserType } from "@prisma/client";

export async function retriveUser(request: Request): Promise<User> {
  const user = (await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  })) as User;
  return user;
}

export async function verifyUser(request: Request, type: UserType) {
  const user = (await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  })) as User;

  if (user.usertype !== type) {
    throw redirect("/auth/login");
  }
  return user;
}
