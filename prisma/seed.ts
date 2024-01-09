import { PrismaClient } from "@prisma/client";

const adminUser = [
  {
    name: "Nischal",
    email: "brand@nischal",
  },
  {
    name: "admin",
    email: "admin@localhost",
  },
  {
    name: "moderator",
    email: "moderator@localhost",
  },
];

const dbclient = new PrismaClient();

async function main() {
  // Check if the admin user already exists
  const existingAdmin = await dbclient.user.findMany({
    where: {
      OR: adminUser.map((user) => ({ email: user.email })),
    },
  });

  // Delete existing admin users
  for (const user of existingAdmin) {
    await dbclient.user.delete({
      where: { email: user.email },
    });
  }

  await dbclient.$transaction(
    adminUser.map((user) => dbclient.user.create({ data: user }))
  );

  await dbclient.$disconnect();
}

main();
