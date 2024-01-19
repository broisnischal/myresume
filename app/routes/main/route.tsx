import { useLoaderData } from "@remix-run/react";
import { ModeToggle } from "@/components/common/mode-toggler";

export async function loader() {
  return null;
}

export default function Main() {
  return (
    <div>
      <ModeToggle />
    </div>
  );
}
