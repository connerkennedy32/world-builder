import { prisma } from '../../../backend/db'
import { NextRequest } from 'next/server'
import { generateNewPageContent } from '../../../utils/pagesHelper'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const title = searchParams.get('title')

    if (title) {
        const page = await prisma.item.findFirst({
            where: {
                itemType: "PAGE",
                title: {
                    equals: title,
                    mode: 'insensitive'
                }
            }
        });

        return Response.json(page)
    } else {
        const pages = await prisma.item.findMany({
            where: {
                itemType: "PAGE",
            },
        });

        return Response.json(pages)
    }
}

export async function POST(req: any) {
    const res = await req.json()
    let { id, content, title, index, parentId } = res;

    if (!content && title) {
        content = generateNewPageContent(title);
    } else if (!content) {
        content = '';
    }

    const newPage = await prisma.item.create({
        data: {
            id,
            itemType: "PAGE",
            content,
            title,
            userId: 1, // Update when I create more than one user
            index,
            parentId,
        },
    });

    return Response.json({ newPage })
}