import { prisma } from '../../../../backend/db'
import { getCurrentUserId } from '@/app/utils/userUtils';

export async function GET(req: any) {
    const userId = await getCurrentUserId()
    if (!userId) {
        return Response.json({ error: 'User not found' }, { status: 401 });
    }
    const pathSegments = req.nextUrl.pathname.split('/');
    const bookId = pathSegments[pathSegments.length - 1];

    const book = await prisma.book.findUnique({
        where: {
            id: Number(bookId),
            userId: userId,
        },
    });

    if (!book) {
        return Response.json({ error: "No book with that ID" }, { status: 404 });
    }

    if (book?.userId !== userId) {
        return Response.json({ error: 'User not authorized to access this book' }, { status: 401 });
    }

    return Response.json(book);
}