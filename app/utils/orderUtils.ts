import { prisma } from '../../backend/db'

export const getHighestNestedOrder = async (folderId: number) => {
    const highestNestedOrderPage = await prisma.page.findFirst({
        where: {
            parentId: folderId
        },
        orderBy: {
            order: 'desc'
        },
        select: {
            order: true
        }
    });

    const highestNestedOrderFolder = await prisma.folder.findFirst({
        where: {
            parentId: folderId
        },
        orderBy: {
            order: 'desc'
        },
        select: {
            order: true
        }
    });

    const highestNestedOrder = Math.max(
        highestNestedOrderPage?.order ?? -1,
        highestNestedOrderFolder?.order ?? -1
    );
    return highestNestedOrder;
}