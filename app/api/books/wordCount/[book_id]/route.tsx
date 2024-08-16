import { prisma } from '../../../../../backend/db'

export async function GET(req: any) {
    const pathSegments = req.nextUrl.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];

    const bookId = parseInt(lastSegment, 10);

    const wordEntries = await prisma.wordEntry.findMany({
        where: {
            bookId,
        },
    });

    if (!wordEntries) {
        return Response.json({ error: "No word entries with that ID" });
    }

    return Response.json({ wordEntries });
}