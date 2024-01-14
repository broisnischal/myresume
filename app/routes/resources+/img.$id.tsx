import { db } from "@/db/db.server";
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  const image = await db.image.findUnique({
    where: {
      id: params.id,
    },
    select: {
      contentType: true,
      blob: true,
    },
  });

  if (!image) {
    throw new Response("Image not found", { status: 404 });
  }

  return new Response(image.blob, {
    headers: {
      "Content-Type": image.contentType,
      "Content-Length": Buffer.byteLength(image.blob).toString(),
      "Content-Disposition": `inline; filename="${params.id}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

// export default function Page() {
//   return <div>resources+ img</div>;
// }
