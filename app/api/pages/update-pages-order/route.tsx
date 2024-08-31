import { prisma } from '../../../../backend/db'
import { Page, Folder } from '@prisma/client';

export async function PUT(req: any) {
    const rows: Page[] | Folder[] = await req.json();

    try {
        rows.map(async (page, index) => {
            const isFolderType = 'pages' in page;
            if (isFolderType) {
                await prisma.folder.update({
                    where: { id: page.id },
                    data: { order: index }
                })
            } else {
                await prisma.page.update({
                    where: { id: page.id },
                    data: { order: index }
                })
            }
        }
        );

        return Response.json('Page orders updated successfully', { status: 200 });
    } catch (error) {
        console.error('Error updating page orders:', error);
        return Response.json('Error updating page orders', { status: 500 });
    }
}