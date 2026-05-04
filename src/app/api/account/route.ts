import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteAccountSchema } from "@/lib/validations";

export async function DELETE(request: Request) {
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

  const parsed = deleteAccountSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const valid = await compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Password is incorrect." }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: user.id } });

  return NextResponse.json({ ok: true });
}
