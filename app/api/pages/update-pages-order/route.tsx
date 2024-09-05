import { prisma } from '../../../../backend/db'
import { TreeItem } from '@/types/itemTypes'

export async function PUT(req: any) {
    const items: TreeItem[] = await req.json();

    try {
        const updateItemIndexes = async (items: TreeItem[], parentId: string | null = null) => {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.index !== i || item.parentId !== parentId) {
                    await prisma.item.update({
                        where: { id: item.id },
                        data: { index: i, parentId }
                    });
                }
                if (item.children && item.children.length > 0) {
                    await updateItemIndexes(item.children, item.id);
                }
            }
        };

        await updateItemIndexes(items);

        return Response.json('Item orders updated successfully', { status: 200 });
    } catch (error) {
        console.error('Error updating item orders:', error);
        return Response.json('Error updating item orders', { status: 500 });
    }
}