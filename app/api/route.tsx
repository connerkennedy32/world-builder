import { prisma } from '../../backend/db'

export async function GET(req: any) {
    const page = req.nextUrl.searchParams.get('page') ? parseInt(req.nextUrl.searchParams.get('page'), 10) : 1;
    const perPage = req.nextUrl.searchParams.get('perPage') ? parseInt(req.nextUrl.searchParams.get('perPage'), 10) : 10;
    const searchQuery = req.nextUrl.searchParams.get('searchQuery') || '';

    const fetchItemsRecursively = async (parentId: string | null = null): Promise<any[]> => {
        const items = await prisma.item.findMany({
            where: { parentId },
            select: {
                id: true,
                parentId: true,
                title: true,
                itemType: true,
                index: true,
                children: true,
            },
            orderBy: {
                index: 'asc',
            },
        });

        for (let item of items) {
            item.children = await fetchItemsRecursively(item.id);
        }

        return items;
    };

    let items = await fetchItemsRecursively();

    return Response.json(items);
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