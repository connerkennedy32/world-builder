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

export async function PUT(req: any) {
    const userId = await getCurrentUserId()
    if (!userId) {
        return Response.json({ error: 'User not found' }, { status: 401 });
    }

    try {
        const pathSegments = req.nextUrl.pathname.split('/');
        const bookId = pathSegments[pathSegments.length - 1];

        // Get the request body
        const body = await req.json();
        const { title, author, goalWordCount } = body;

        // Ensure goalWordCount is a number if provided
        const parsedGoalWordCount = goalWordCount !== undefined ? Number(goalWordCount) : undefined;

        // Verify the book exists and belongs to the user
        const existingBook = await prisma.book.findUnique({
            where: {
                id: Number(bookId),
                userId: userId,
            },
        });

        if (!existingBook) {
            return Response.json({ error: "No book with that ID" }, { status: 404 });
        }

        if (existingBook.userId !== userId) {
            return Response.json({ error: 'User not authorized to update this book' }, { status: 401 });
        }

        // Update the book with provided fields
        const updatedBook = await prisma.book.update({
            where: {
                id: Number(bookId),
            },
            data: {
                ...(title !== undefined && { title }),
                ...(author !== undefined && { author }),
                ...(parsedGoalWordCount !== undefined && { goalWordCount: parsedGoalWordCount }),
            },
        });

        return Response.json(updatedBook);
    } catch (error) {
        console.error('Error updating book:', error);
        return Response.json({ error: 'Failed to update book' }, { status: 500 });
    }
}