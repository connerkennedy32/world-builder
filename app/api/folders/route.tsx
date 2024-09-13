import { prisma } from '@/backend/db'
import { getCurrentUserId } from '@/app/utils/userUtils'

export async function POST(req: any) {
    try {
        const userId = await getCurrentUserId()
        if (!userId) {
            return Response.json({ error: 'User not found' }, { status: 401 });
        }
        const res = await req.json()
        let { title, parentId, index } = res;

        const folderData: any = {
            title,
            itemType: "FOLDER",
            userId,
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
        const userId = await getCurrentUserId()
        if (!userId) {
            return Response.json({ error: 'User not found' }, { status: 401 });
        }
        const folders = await prisma.item.findMany({
            where: {
                itemType: "FOLDER",
                userId,
            },
        });

        return Response.json({ folders });
    } catch (error) {
        console.error('Error fetching folders:', error);
        return Response.json({ error: 'An error occurred while fetching folders.' }, { status: 500 });
    }
}
