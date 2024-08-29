import { prisma } from '../../../backend/db'
import { NextRequest } from 'next/server'
import { generateNewPageContent } from '../../../utils/pagesHelper'

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

export async function POST(req: any) {
    const res = await req.json()
    let { content, title } = res;

    if (!content && title) {
        content = generateNewPageContent(title);
    } else if (!content) {
        content = '';
    }

    const mostRecentPage = await prisma.page.findFirst({
        select: { order: true },
        orderBy: { order: 'desc' },
    });

    const newPage = await prisma.page.create({
        data: {
            content,
            title,
            userId: 1, // Update when I create more than one user
            order: mostRecentPage ? mostRecentPage.order + 1000 : 1000
        },
    });

    return Response.json({ newPage })
}