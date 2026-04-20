import { NextResponse } from "next/server";
import { prisma } from "@/backend/db";
import { getCurrentUserId } from "@/app/utils/userUtils";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const chats = await prisma.chat.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      messages: {
        take: 1,
        orderBy: { createdAt: "asc" },
        select: { content: true },
      },
    },
  });

  return NextResponse.json(chats);
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, messages } = await req.json();

  const chat = await prisma.chat.create({
    data: {
      title: title || "New Chat",
      userId,
      messages: {
        create: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      },
    },
    include: { messages: true },
  });

  return NextResponse.json(chat);
}
