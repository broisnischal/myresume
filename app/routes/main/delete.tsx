import { Alert } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Resume } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { LoaderIcon, Trash, Trash2Icon } from "lucide-react";
import { useState } from "react";

export default function Delete({ item }: { item: Resume }) {
  const deleteFetcher = useFetcher({ key: "delete" });
  const [deleteInput, setDeleteInput] = useState("");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2Icon className="cursor-pointer" size={15} />
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to delete your Resume?
          </AlertDialogTitle>
          <Alert title="warning" variant={"destructive"}>
            This action is not reversible. Please be certain.
          </Alert>
          <AlertDialogDescription>
            To delete your resume type{" "}
            <strong className="text-primary">delete {item.slug}</strong> and
            continue.
          </AlertDialogDescription>
          <Input
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
            type="text"
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <deleteFetcher.Form method="post">
            <input type="hidden" value={item.id} name="id" />
            <Button
              disabled={deleteInput !== `delete ${item.slug}`}
              type="submit"
              name="_intent"
              value={"delete"}
              variant="destructive"
            >
              {deleteFetcher.state !== "submitting" ? (
                <Trash size={14} />
              ) : (
                <LoaderIcon size={14} className="animate-spin" />
              )}
              <span className="ml-2">Delete</span>
            </Button>
          </deleteFetcher.Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
