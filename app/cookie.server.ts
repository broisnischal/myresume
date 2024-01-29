import { createCookie } from "@remix-run/node";

export const tosBannerCookie = createCookie("tosBanner", {
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
  path: "/",
});

export const resizeCookie = createCookie("resize", {
  maxAge: 12 * 60 * 60 * 24 * 30, // 1 year
  sameSite: "lax",
  path: "/",
});
