import { prisma } from '../../backend/db'

export async function GET(req: any) {
    const page = req.nextUrl.searchParams.get('page') ? parseInt(req.nextUrl.searchParams.get('page'), 10) : 1;
    const perPage = req.nextUrl.searchParams.get('perPage') ? parseInt(req.nextUrl.searchParams.get('perPage'), 10) : 10;
    const searchQuery = req.nextUrl.searchParams.get('searchQuery') || '';

    let pages = await prisma.page.findMany({
        where: {
            folderId: {
                equals: null
            }
        },
        orderBy: {
            order: 'asc'
        }
    });

    let folders = await prisma.folder.findMany({
        where: {
            nestedOrder: {
                equals: null,
            }
        },
        include: {
            children: {
                include: {
                    children: true,
                    pages: true,
                }
            },
            pages: {
                orderBy: {
                    order: 'asc'
                }
            }
        },
        orderBy: {
            order: 'asc'
        }
    })

    const combinedItems = [...pages, ...folders].sort((a, b) => a.order - b.order);

    return Response.json(combinedItems);
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