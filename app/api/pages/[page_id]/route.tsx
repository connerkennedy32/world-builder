import { prisma } from '../../../../backend/db'

// Handle GET request to retrieve product information for a specific ID
export async function GET(req: any) {
    const pathSegments = req.nextUrl.pathname.split('/'); // Split the path into segments
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
    const pathSegments = req.nextUrl.pathname.split('/'); // Split the path into segments
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
        console.error('Error updating page orders:', error);
        return Response.json('Error updating page orders', { status: 500 });
    }

}