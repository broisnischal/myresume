// import { db } from "@/db/db.server";
// import type { DataFunctionArgs } from "@remix-run/node";

// export async function loader({ params }: DataFunctionArgs) {
//   const image = await db.userImage.findUnique({
//     where: {
//       id: params.id,
//     },
//     select: {
//       contentType: true,
//       blob: true,
//     },
//   });

//   if (!image) {
//     throw new Response("Not found", { status: 404 });
//   }

//   return new Response(image.blob, {
//     headers: {
//       "Content-Type": image.contentType,
//       "Content-Length": Buffer.byteLength(image.blob).toString(),
//       "Content-Disposition": `inline; filename="${params.id}"`,
//       "Cache-Control": "public, max-age=31536000, immutable",
//     },
//   });
// }

export default function Page() {
  return <div>resources+ img</div>;
}
