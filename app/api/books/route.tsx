import { prisma } from '@/backend/db'
import { getCurrentUserId } from '@/app/utils/userUtils'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const viewAll = searchParams.get('viewAll') === 'true'

    const userId = await getCurrentUserId()

    let whereClause = {}
    if (!viewAll && userId) {
        whereClause = { userId: userId }
    }

    const books = await prisma.book.findMany({
        where: whereClause
    })

    return Response.json(books);
}

export async function POST(req: Request) {
    const userId = await getCurrentUserId()
    if (!userId) {
        return Response.json({ error: 'User not found' }, { status: 401 });
    }

    const { title, goalWordCount, author } = await req.json();

    try {
        const newBook = await prisma.book.create({
            data: {
                title,
                userId,
                goalWordCount,
                author
            },
        });

        return Response.json(newBook, { status: 201 });
    } catch (error) {
        console.error('Error creating book:', error);
        return Response.json({ error: 'Error creating book' }, { status: 500 });
    }
}