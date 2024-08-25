import { prisma } from '../../../backend/db'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const title = searchParams.get('title')

    if (title) {
        const page = await prisma.page.findFirst({
            where: {
                title: {
                    equals: title,
                    mode: 'insensitive'
                }
            }
        });

        return Response.json(page)
    } else {
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
}