// /* eslint-disable jsx-a11y/label-has-associated-control */
// import { db } from "@/db/db.server";
// import { retriveUser } from "@/utils/auth.utils.server";
// import { User } from "@prisma/client";
// import {
//   ActionFunctionArgs,
//   json,
//   unstable_createMemoryUploadHandler,
//   unstable_parseMultipartFormData,
// } from "@remix-run/node";
// import { Form, useNavigation, useSubmit } from "@remix-run/react";
// import { Camera } from "lucide-react";
// import { useState } from "react";
// import { toast } from "sonner";

// const MAX_SIZE = 1024 * 1024 * 2; // 2MB

// export async function action({ request }: ActionFunctionArgs) {
//   const user = (await retriveUser(request)) as User;

//   const formData = await unstable_parseMultipartFormData(
//     request,
//     unstable_createMemoryUploadHandler({
//       maxPartSize: MAX_SIZE,
//     })
//   );

//   const file = formData.get("image") as File;

//   const contentType = file.type;
//   const blob = Buffer.from(await file.arrayBuffer());

//   await db.$transaction(async (tx) => {
//     await tx.user.update({
//       where: {
//         id: user.id,
//       },
//       data: {
//         userImages: {
//           upsert: {
//             create: {
//               contentType,
//               blob,
//             },
//             update: {
//               contentType,
//               blob,
//             },
//           },
//         },
//       },
//     });
//   });

//   return json({ contentType, blob });
// }

// export default function ImageUploader() {
//   const [image, setImage] = useState<File | null>(null);

//   const submit = useSubmit();
//   const navigation = useNavigation();

//   const isUploading = navigation.state !== "idle";
//   //   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {};

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
//     if (file.size > MAX_SIZE) {
//       //   alert("File size exceeds the limit of 2MB");
//       toast.error("File size exceeds the limit of 2MB");
//       return;
//     }
//     setImage(file);
//   };

//   return (
//     <>
//       <Form method="post" action="#" encType="multipart/form-data">
//         {isUploading ? (
//           "Uploading..."
//         ) : image ? (
//           <label htmlFor="image-uploader">
//             <img
//               src={URL.createObjectURL(image)}
//               alt=""
//               loading="lazy"
//               className="w-32 cursor-pointer h-32 rounded-full object-cover object-center overflow-hidden"
//             />
//           </label>
//         ) : (
//           <label
//             htmlFor="image-uploader"
//             className="cursor-pointer w-32 h-32 bg-black/10 text-primary/70 rounded-full flex items-center justify-center"
//           >
//             <Camera size={30} />
//           </label>
//         )}
//         <input
//           type="file"
//           hidden
//           name="image"
//           onChange={handleFileChange}
//           accept="image/*"
//           id="image-uploader"
//         />
//         <button>Upload</button>
//       </Form>
//     </>
//   );
// }
