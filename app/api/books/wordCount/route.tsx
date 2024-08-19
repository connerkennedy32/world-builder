import { prisma } from '../../../../backend/db'

export async function POST(req: Request) {
    const { bookId, wordCount, date } = await req.json();

    try {
        const newWordEntry = await prisma.wordEntry.create({
            data: {
                bookId: parseInt(bookId),
                wordCount: parseInt(wordCount),
                date: new Date(date),
            },
        });

        return Response.json({ newWordEntry }, { status: 201 });
    } catch (error) {
        console.error('Error creating word entry:', error);
        return Response.json({ error: 'Error creating word entry' }, { status: 500 });
    }
}
