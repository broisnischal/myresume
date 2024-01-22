import { db } from "@/db/db.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import sharp from "sharp"; // Import sharp for image manipulation

const decreaseQuality = async (
  blob: Buffer,
  quality: number
): Promise<Buffer> => {
  return sharp(blob).jpeg({ quality: quality }).toBuffer();
};

const cropImage = async (
  blob: Buffer,
  cropOptions: sharp.Region
): Promise<Buffer> => {
  return sharp(blob).extract(cropOptions).toBuffer();
};

export async function loader({ params }: LoaderFunctionArgs) {
  const image = await db.user.findUnique({
    where: {
      id: params.id,
    },
    select: {
      userImages: {
        select: {
          contentType: true,
          blob: true,
        },
      },
    },
  });

  if (!image?.userImages) {
    throw new Response("Image not found", { status: 404 });
  }

  let modifiedImageBlob = image.userImages.blob;
  // modifiedImageBlob = await cropImage(modifiedImageBlob, {
  //   left: 0,
  //   top: 50,
  //   width: 400,
  //   height: 400,
  // });

  modifiedImageBlob = await decreaseQuality(modifiedImageBlob, 70);

  return new Response(modifiedImageBlob, {
    headers: {
      "Content-Type": image.userImages?.contentType,
      "Content-Length": Buffer.byteLength(modifiedImageBlob).toString(),
      "Content-Disposition": `inline; filename="${params.id}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
