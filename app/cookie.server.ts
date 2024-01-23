import { createCookie } from "@remix-run/node";

export const tosBannerCookie = createCookie("tosBanner", {
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
  path: "/",
});
