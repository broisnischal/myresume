// import { useLoaderData } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import { PlusIcon } from "lucide-react";
import { retriveUser } from "@/utils/auth.utils.server";
import { LoaderFunctionArgs, json } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await retriveUser(request);

  return json({
    user,
  });
}

export default function Main() {
  const data = useLoaderData<typeof loader>();
  const user = data.user;

  const submit = useSubmit();

  return (
    <div className="p-10">
      <div className="flex items-center justify-between w-10/12 m-auto">
        <h2 className="text-4xl tracking-tighter font-bold">Your Resumes</h2>
        <div>
          <DropdownMenu onOpenChange={() => {}}>
            <DropdownMenuTrigger>
              <Avatar className="border-[1px]">
                {user.avatar_url && <AvatarImage src={user.avatar_url} />}
                <AvatarFallback>
                  {String(user.name?.split(" ")).split("")[0].toUpperCase()}
                  {String(user.name?.split(" ")[1]).split("")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              {/* <logout.Form method="post" action="/logout"> */}
              <DropdownMenuItem
                onClick={() => submit("/logout", { method: "post" })}
              >
                <input type="text" hidden name="_intent" value="logout" />
                <button className="w-full text-left" type="submit">
                  Logout
                </button>
              </DropdownMenuItem>
              {/* </logout.Form> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator className="h-[10px]" />
      <Link to={"/resume/asdfasdf"}>Dummy Resume</Link>

      <div className="box">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-[200px] aspect-square" variant="outline">
              <div className="flex flex-col items-center">
                <PlusIcon />
                Add a resume
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a resume</DialogTitle>
              <DialogDescription>
                Make the resume, with the best AI and more with the best.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Resume
                </Label>
                <Input id="name" value="Pedro Duarte" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" value="@peduarte" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
