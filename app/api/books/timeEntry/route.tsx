import { prisma } from '../../../../backend/db'

export async function POST(req: Request) {
    const { bookId, minutes } = await req.json();

    try {
        const newTimeEntry = await prisma.timeEntry.create({
            data: {
                bookId: parseInt(bookId),
                minutes: parseInt(minutes),
                date: new Date(),
            },
        });

        return Response.json({ newTimeEntry }, { status: 201 });
    } catch (error) {
        console.error('Error creating time entry:', error);
        return Response.json({ error: 'Error creating time entry' }, { status: 500 });
    }
}