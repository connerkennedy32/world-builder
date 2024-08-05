import { prisma } from '../../../../backend/db'

export async function PUT(req: any) {
    const pathSegments = req.nextUrl.pathname.split('/'); // Split the path into segments
    const lastSegment = pathSegments[pathSegments.length - 1];

    const folderId = parseInt(lastSegment, 10);
    const res = await req.json()

    try {
        const updatedFolder = await prisma.folder.update({
            where: {
                id: folderId,
            },
            data: {
                ...res,
            },
        })
        return Response.json({ updatedFolder });
    } catch (error) {
        console.error('Error updating folder:', error);
        return Response.json('Error updating folder', { status: 500 });
    }
}