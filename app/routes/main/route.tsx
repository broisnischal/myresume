import { useLoaderData } from "@remix-run/react";
import { db } from "@/db/db.server";
import { ModeToggle } from "@/components/common/mode-toggler";

export async function loader() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const users = await db.user.findMany();

  return { users };
}

export default function Main() {
  const users = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>hello</h1>

      {users.users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
      <ModeToggle />
    </div>
  );
}
