import { prisma } from '../../../backend/db'
import { NextRequest } from 'next/server'
import { generateNewPageContent } from '../../../utils/pagesHelper'
import { getCurrentUserId } from '@/app/utils/userUtils';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const title = searchParams.get('title')
    const userId = await getCurrentUserId()
    if (title) {
        const page = await prisma.item.findFirst({
            where: {
                itemType: "PAGE",
                title: {
                    equals: title,
                    mode: 'insensitive'
                },
                userId: userId
            }
        });

        return Response.json(page)
    } else {
        const pages = await prisma.item.findMany({
            where: {
                itemType: "PAGE",
                userId: userId
            },
        });

        return Response.json(pages)
    }
}

export async function POST(req: any) {
    const userId = await getCurrentUserId()
    if (!userId) {
        return Response.json({ error: 'User not found' }, { status: 401 });
    }
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
            userId,
            index,
            parentId,
        },
    });

    return Response.json({ newPage })
}