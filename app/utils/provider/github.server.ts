import { db } from "@/db/db.server";
import { GitHubStrategy } from "remix-auth-github";

const gitHubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
  },
  async ({ accessToken, extraParams, profile }) => {
    console.log({ accessToken, extraParams, profile });

    const existUser = await db.user.findFirst({
      where: {
        email: profile.emails[0].value,
        connection: {
          some: {
            providerId: profile.id,
            providerName: profile.provider,
          },
        },
      },
    });

    if (existUser) {
      return existUser;
    }

    return await db.user.create({
      data: {
        email: profile.emails[0].value,
        username: profile.displayName,
        avatar_url: profile.photos[0].value,
        github_bio: profile._json.bio,
        github_username: profile.displayName,
        twitter_username: profile._json.twitter_username,
        website: profile._json.blog,
        name: profile.name.givenName,
        location: profile._json.location,

        connection: {
          create: {
            providerId: profile.id,
            providerName: profile.provider,
          },
        },
      },
    });
  }
);

export default gitHubStrategy;
