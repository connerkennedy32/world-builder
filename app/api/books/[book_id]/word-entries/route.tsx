import { prisma } from '@/backend/db';
import { getCurrentUserId } from '@/app/utils/userUtils';

export async function GET(req: any) {
    const userId = await getCurrentUserId()
    if (!userId) {
        return Response.json({ error: 'User not found' }, { status: 401 });
    }
    const pathSegments = req.nextUrl.pathname.split('/');
    const bookId = pathSegments[pathSegments.length - 2];

    const wordEntries = await prisma.wordEntry.findMany({
        where: {
            bookId: Number(bookId),
        },
        orderBy: {
            date: 'asc',
        },
    });

    if (!wordEntries) {
        return Response.json({ error: "No word entries found" }, { status: 404 });
    }

    return Response.json(wordEntries);
}