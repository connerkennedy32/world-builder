import { prisma } from '../../../../backend/db'

// Handle GET request to retrieve product information for a specific ID
export async function GET(req: any) {
    const pathSegments = req.nextUrl.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];

    const pageId = parseInt(lastSegment, 10);

    const page = await prisma.page.findUnique({
        where: {
            id: pageId,
        },
    });

    if (!page) {
        return Response.json({ error: "No page with that ID" });
    }

    return Response.json({ page });
}

export async function PUT(req: any) {
    const pathSegments = req.nextUrl.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];

    const pageId = parseInt(lastSegment, 10);
    const res = await req.json()

    try {
        const updatedPage = await prisma.page.update({
            where: {
                id: pageId,
            },
            data: {
                ...res,
            },
        })
        return Response.json({ updatedPage });
    } catch (error) {
        console.error('Error updating page:', error);
        return Response.json('Error updating page', { status: 500 });
    }
}

export async function DELETE(req: any) {
    const pathSegments = req.nextUrl.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];

    const pageId = parseInt(lastSegment, 10);

    try {
        const deletedPage = await prisma.page.delete({
            where: {
                id: pageId,
            }
        })
        return Response.json({ deletedPage });
    } catch (error) {
        console.error('Error deleting page:', error);
        return Response.json('Error deleting page', { status: 500 });
    }
}