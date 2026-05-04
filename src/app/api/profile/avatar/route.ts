import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "File uploads are not configured. Set BLOB_READ_WRITE_TOKEN in Vercel, or add a profile image URL on the profile page.",
      },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file field." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be 2MB or smaller." }, { status: 400 });
  }

  const type = file.type;
  if (!ALLOWED.has(type)) {
    return NextResponse.json({ error: "Use JPEG, PNG, WebP, or GIF." }, { status: 400 });
  }

  const ext = type === "image/jpeg" ? "jpg" : type.split("/")[1];
  const pathname = `avatars/${session.user.id}/${Date.now()}.${ext}`;

  const blob = await put(pathname, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { image: blob.url },
    select: { image: true },
  });

  return NextResponse.json({ url: user.image });
}
