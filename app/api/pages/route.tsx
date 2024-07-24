import { prisma } from '../../../backend/db'

export async function GET(req: any) {
    const pages = await prisma.folder.findMany({
        include: {
            pages: {
                orderBy: {
                    order: 'asc'
                }
            }
        },
    });

    return Response.json(pages)
}