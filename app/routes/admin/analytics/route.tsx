import { User } from "@prisma/client";
import { useOutletContext } from "@remix-run/react";

export default function Analytics() {
  const contextdata: User = useOutletContext();

  console.log(contextdata);

  return (
    <div>
      <h2>{contextdata.email} is admin</h2>
      <h1>Analytics</h1>
    </div>
  );
}
