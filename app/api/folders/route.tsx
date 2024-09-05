import { prisma } from '../../../backend/db'

export async function POST(req: any) {
    try {
        const res = await req.json()
        let { title, parentId, index } = res;

        const folderData: any = {
            title,
            itemType: "FOLDER",
            userId: 1, // Update when I create more than one user
            index,
        };

        if (parentId) {
            folderData.parentId = parentId;
        }

        const newFolder = await prisma.item.create({
            data: folderData,
        });

        return Response.json({ newFolder })
    } catch (error: any) {
        console.error('Error creating folder:', error);
        return Response.json({ error: 'An error occurred while creating the folder.' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const folders = await prisma.item.findMany({
            where: {
                itemType: "FOLDER",
                userId: 1, // Update when you create more than one user
            },
        });

        return Response.json({ folders });
    } catch (error) {
        console.error('Error fetching folders:', error);
        return Response.json({ error: 'An error occurred while fetching folders.' }, { status: 500 });
    }
}
