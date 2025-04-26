import { prisma } from "@/backend/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const clerkId = url.searchParams.get("clerkId");

        if (!clerkId) {
            return new NextResponse("Clerk ID is required", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: {
                clerkId: clerkId,
            },
            select: {
                id: true,
            },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json({ userId: user.id });
    } catch (error) {
        console.error("[USERS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
