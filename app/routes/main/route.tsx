import { useLoaderData } from "@remix-run/react";
import { db } from "@/db/db.server";

export async function loader() {
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
    </div>
  );
}
