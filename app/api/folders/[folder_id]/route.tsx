import { prisma } from '../../../../backend/db'
import { getHighestNestedOrder } from '@/app/utils/orderUtils';

export async function PUT(req: any) {
    const pathSegments = req.nextUrl.pathname.split('/'); // Split the path into segments
    const lastSegment = pathSegments[pathSegments.length - 1];

    const folderId = parseInt(lastSegment, 10);
    const { title, order, parentId } = await req.json();

    const shouldUpdateOrder = !!parentId && !order;

    let newNestedOrder = order;
    if (!!parentId && !order) {
        newNestedOrder = await getHighestNestedOrder(parentId);
    }

    try {
        const updatedFolder = await prisma.folder.update({
            where: {
                id: folderId,
            },
            data: {
                title,
                order: shouldUpdateOrder ? newNestedOrder + 1 : order,
                parentId,
            },
        })
        return Response.json({ updatedFolder });
    } catch (error) {
        console.error('Error updating folder:', error);
        return Response.json('Error updating folder', { status: 500 });
    }
}