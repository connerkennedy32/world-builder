import { prisma } from '../../../../backend/db'
import { getHighestNestedOrder } from '@/app/utils/orderUtils';

export async function PUT(req: any) {
    const pathSegments = req.nextUrl.pathname.split('/'); // Split the path into segments
    const folderId = pathSegments[pathSegments.length - 1];

    const { title, parentId, index } = await req.json();

    try {
        const updatedFolder = await prisma.item.update({
            where: {
                id: folderId,
            },
            data: {
                title,
                parentId,
                index,
            },
        })
        return Response.json({ updatedFolder });
    } catch (error) {
        console.error('Error updating folder:', error);
        return Response.json('Error updating folder', { status: 500 });
    }
}