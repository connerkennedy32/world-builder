import { prisma } from '../../../../backend/db'
import { getHighestNestedOrder } from '@/app/utils/orderUtils';
import { getCurrentUserId } from '@/app/utils/userUtils';

// Handle GET request to retrieve product information for a specific ID
export async function GET(req: any) {
    const userId = await getCurrentUserId()
    if (!userId) {
        return Response.json({ error: 'User not found' }, { status: 401 });
    }
    const pathSegments = req.nextUrl.pathname.split('/');
    const pageId = pathSegments[pathSegments.length - 1];

    const page = await prisma.item.findUnique({
        where: {
            id: pageId,
        },
    });

    if (!page) {
        return Response.json({ error: "No page with that ID" }, { status: 404 });
    }

    if (page?.userId !== userId) {
        return Response.json({ error: 'User not authorized to access this page' }, { status: 401 });
    }

    return Response.json({ page });
}

export async function PUT(req: any) {
    const userId = await getCurrentUserId()
    if (!userId) {
        return Response.json({ error: 'User not found' }, { status: 401 });
    }
    const pathSegments = req.nextUrl.pathname.split('/');
    const pageId = pathSegments[pathSegments.length - 1];

    const { title, content, parentId } = await req.json();

    try {
        const updatedPage = await prisma.item.update({
            where: {
                id: pageId,
                userId: userId,
            },
            data: {
                title,
                content,
                parentId,
            },
        });
        return Response.json({ updatedPage });
    } catch (error) {
        console.error('Error updating page:', error);
        return Response.json('Error updating page', { status: 500 });
    }
}

export async function DELETE(req: any) {
    const pathSegments = req.nextUrl.pathname.split('/');
    const pageId = pathSegments[pathSegments.length - 1];

    try {
        const deletedPage = await prisma.item.delete({
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