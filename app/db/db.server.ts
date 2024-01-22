// import type { User } from "@prisma/client";

import { remember } from "@epic-web/remember";
import { PrismaClient } from "@prisma/client";

export const db = remember("db", () => {
  const client = new PrismaClient().$extends({
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
      resume: {
        async isSlugAvailable(slug: string): Promise<boolean> {
          const resume = await db.resume.findUnique({
            where: { slug },
          });
          if (resume) {
            return false;
          }
          return true;
        },
      },
    },
  });
  return client;
});

// .$use(async (params) => {
//   if (params.action.startsWith("findMany")) {
//     if (params.action === "findMany") {
//       params.args.orderBy = { createdAt: "desc" };
//     }
//   }
// })
