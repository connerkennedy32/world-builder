import { prisma } from '../../../../backend/db'
import { NextResponse } from 'next/server';

interface Page {
    id: number;
    content: string;
    title: string;
    folderId: number | null;
    userId: number;
    order: number;
    pages?: Page[]
}

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