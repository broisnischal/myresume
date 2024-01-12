// import type { User } from "@prisma/client";

import { remember } from "@epic-web/remember";
import { PrismaClient } from "@prisma/client";

export const db = remember("db", () =>
  new PrismaClient().$extends({
    model: {
      user: {
        // async findOrCreate(data: Pick<User, "email">): Promise<User> {
        //   const user = await db.user.findFirst({
        //     where: { email: data.email },
        //   });
        //   if (user) {
        //     return user;
        //   }
        //   return db.user.create({
        //     data: {
        //       email: data.email,
        //     },
        //   });
        // },
      },
    },
  })
);
