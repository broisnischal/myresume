import { createCookie, createCookieSessionStorage } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";

const isProduction = process.env.NODE_ENV === "production";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    // ...(isProduction
    //   ? { domain: "myresume.fly.app", secure: true }
    //   : { domain: "localhost", secure: false }),
  },
});

export const cookie = createCookie("defaultSize");

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
