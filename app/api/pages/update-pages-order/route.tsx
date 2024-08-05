import { prisma } from '../../../../backend/db'
import { Page } from '@/app/types/page';

export async function PUT(req: any) {
    const pages: Page[] = await req.json();

    try {
        const updatePromises = pages.map(async (page, index) => {
            const isFolderType = !!page.pages;
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

        await Promise.all(updatePromises);
        return Response.json('Page orders updated successfully', { status: 200 });
    } catch (error) {
        console.error('Error updating page orders:', error);
        return Response.json('Error updating page orders', { status: 500 });
    }
}