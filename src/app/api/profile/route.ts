import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { profileUpdateSchema } from "@/lib/validations";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const { name, email, image } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail !== session.user.email?.toLowerCase()) {
    const taken = await prisma.user.findFirst({
      where: { email: normalizedEmail, NOT: { id: session.user.id } },
    });
    if (taken) {
      return NextResponse.json({ error: "That email is already in use." }, { status: 409 });
    }
  }

  const data: { name: string; email: string; image?: string | null } = {
    name,
    email: normalizedEmail,
  };
  if (image !== undefined) {
    data.image = image === "" || image === null ? null : image;
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { id: true, email: true, name: true, image: true },
  });

  return NextResponse.json({ user });
}
