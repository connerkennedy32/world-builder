import { prisma } from '../../backend/db'

export async function GET(req: any) {
    const page = req.nextUrl.searchParams.get('page') ? parseInt(req.nextUrl.searchParams.get('page'), 10) : 1;
    const perPage = req.nextUrl.searchParams.get('perPage') ? parseInt(req.nextUrl.searchParams.get('perPage'), 10) : 10;
    const searchQuery = req.nextUrl.searchParams.get('searchQuery') || '';
    const isSold = req.nextUrl.searchParams.get('isSold') || null;

    let pages = await prisma.page.findMany({
        where: {
            content: {
                not: 'empty'
            }
        },
        orderBy: {
            id: 'asc'
        }
    });

    return Response.json(pages);
}

export async function POST(req: any) {
    const res = await req.json()
    let { content, title } = res;

    if (!content && title) {
        content = `<h1>${title}</h1>`;
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

export async function PUT(req: any) {
    const pageId = parseInt(req.nextUrl.searchParams.get('id'), 10); // Assuming the product ID is part of the URL

    const existingProduct = await prisma.page.findUnique({
        where: {
            id: pageId,
        },
    });

    if (!existingProduct) {
        return Response.json({ error: 'Page not found' });
    }

    const updatedPageData = await req.json();
    const { title, content } = updatedPageData;

    const updatedPage = await prisma.page.update({
        where: {
            id: pageId,
        },
        data: {
            title,
            content
        },
    });

    return Response.json({ updatedPage });
}