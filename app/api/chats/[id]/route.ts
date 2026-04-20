import { NextResponse } from "next/server";
import { prisma } from "@/backend/db";
import { getCurrentUserId } from "@/app/utils/userUtils";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const chat = await prisma.chat.findFirst({
    where: { id: params.id, userId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!chat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(chat);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { messages } = await req.json();

  const chat = await prisma.chat.update({
    where: { id: params.id },
    data: {
      updatedAt: new Date(),
      messages: {
        create: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      },
    },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  return NextResponse.json(chat);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.chat.deleteMany({ where: { id: params.id, userId } });
  return NextResponse.json({ success: true });
}
