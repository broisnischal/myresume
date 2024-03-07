import { OAuth2Strategy } from "remix-auth-oauth2";

export const linkedInStratedy = new OAuth2Strategy(
  {
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: process.env.LINKEDIN_CALLBACK_URL,
    authorizationURL: "https://www.linkedin.com/oauth/v2/authorization",
    tokenURL: "https://www.linkedin.com/oauth/v2/accessToken",
    scope: "r_liteprofile",
  },
  async ({
    accessToken,
    refreshToken,
    extraParams,
    profile,
    context,
    request,
  }) => {
    console.log({ accessToken, refreshToken, extraParams, profile });

    // here you can use the params above to get the user and return it
    // what you do inside this and how you find the user is up to you
    return profile;
  }
);
