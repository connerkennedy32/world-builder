import { prisma } from '@/backend/db';
import { getCurrentUserId } from '@/app/utils/userUtils';

export async function GET(req: any) {
    const userId = await getCurrentUserId()
    if (!userId) {
        return Response.json({ error: 'User not found' }, { status: 401 });
    }
    const pathSegments = req.nextUrl.pathname.split('/');
    const bookId = pathSegments[pathSegments.length - 2];

    const timeEntries = await prisma.timeEntry.findMany({
        where: {
            bookId: Number(bookId),
        },
        orderBy: {
            date: 'asc',
        },
    });

    return Response.json(timeEntries);
}
