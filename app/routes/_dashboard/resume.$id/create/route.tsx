/* eslint-disable jsx-a11y/label-has-associated-control */
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/db/db.server";
import { retriveUser } from "@/utils/auth.utils.server";
import { User } from "@prisma/client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { Camera } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MAX_SIZE = 1024 * 1024 * 2; // 2MB

export async function loader({ request }: LoaderFunctionArgs) {
  const user = (await retriveUser(request)) as User;

  const userImage = await db.image.findFirst({
    where: {
      User: {
        some: {
          id: user.id,
        },
      },
    },
  });

  return json({ userImage, user });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = (await retriveUser(request)) as User;

  const formData = await unstable_parseMultipartFormData(
    request,
    unstable_createMemoryUploadHandler({
      maxPartSize: MAX_SIZE,
    })
  );

  const file = formData.get("image") as File;

  const contentType = file.type;
  const blob = Buffer.from(await file.arrayBuffer());

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        userImages: {
          upsert: {
            create: {
              contentType,
              blob,
            },
            update: {
              contentType,
              blob,
            },
          },
        },
      },
    });
  });

  return json({ blob, contentType });
}

export default function CreateResume() {
  const [image, setImage] = useState<File | null>(null);
  // const fetcher = useFetcher();
  const { userImage } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const isUploading = navigation.state !== "idle";

  //   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {};

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_SIZE) {
      //   alert("File size exceeds the limit of 2MB");
      toast.error("File size exceeds the limit of 2MB");
      return;
    }
    setImage(file);
  };

  return (
    <div>
      <h1>Create Resume</h1>
      <Form method="post" encType="multipart/form-data">
        {isUploading ? (
          <Skeleton className="w-32 h-32 opacity-40 rounded-full ">
            <img
              src={URL.createObjectURL(image!)}
              alt=""
              loading="lazy"
              className="w-32 cursor-pointer h-32 rounded-full object-cover object-center overflow-hidden"
            />
          </Skeleton>
        ) : image ? (
          <label htmlFor="image-uploader">
            <img
              src={URL.createObjectURL(image)}
              alt=""
              loading="lazy"
              className="w-32 cursor-pointer h-32 rounded-full object-cover object-center overflow-hidden"
            />
          </label>
        ) : userImage?.id ? (
          <label
            htmlFor="image-uploader"
            className="cursor-pointer w-32 h-32 bg-black/10 text-primary/70 rounded-full flex items-center justify-center"
          >
            <img
              src={`/resources/img/${userImage.id}`}
              className="w-32 h-32 rounded-full overflow-hidden object-center object-cover"
              alt=""
            />
          </label>
        ) : (
          <label
            htmlFor="image-uploader"
            className="cursor-pointer w-32 h-32 bg-black/10 text-primary/70 rounded-full flex items-center justify-center"
          >
            <Camera size={30} />
          </label>
        )}
        <input
          type="file"
          hidden
          name="image"
          onChange={handleFileChange}
          accept="image/*"
          id="image-uploader"
        />
        <button>Upload</button>
      </Form>
    </div>
  );
}
