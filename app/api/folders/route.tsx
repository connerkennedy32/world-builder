import { prisma } from '../../../backend/db'

export async function POST(req: any) {
    try {
        const res = await req.json()
        let { title, folderId, order, nestedOrder } = res;

        const mostRecentFolder = await prisma.folder.findFirst({
            select: { order: true },
            orderBy: { order: 'desc' },
        });

        const folderData: any = {
            title,
            userId: 1, // Update when I create more than one user
        };

        if (order !== undefined) {
            folderData.order = order;
        } else {
            folderData.order = mostRecentFolder ? mostRecentFolder.order + 1000 : 1000;
        }

        if (folderId) {
            folderData.parentId = folderId;
        }

        if (nestedOrder !== undefined) {
            folderData.nestedOrder = nestedOrder;
        }

        const newFolder = await prisma.folder.create({
            data: folderData,
        });

        return Response.json({ newFolder })
    } catch (error: any) {
        console.error('Error creating folder:', error);
        return Response.json({ error: 'An error occurred while creating the folder.' }, { status: 500 });
    }
}