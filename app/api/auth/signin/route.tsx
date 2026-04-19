import { prisma } from "@/backend/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name } = await req.json();

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: { username: name },
            select: { id: true, email: true },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const response = NextResponse.json({ userId: user.id, email: user.email });
        response.cookies.set('userId', String(user.id), { path: '/', sameSite: 'lax' });
        return response;
    } catch (error) {
        console.error("[AUTH_SIGNIN]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
