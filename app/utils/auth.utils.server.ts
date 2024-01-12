import authenticator from "./auth.server";

export async function retriveUser(request: Request) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });
  return user;
}
