import { prisma } from '../../../../backend/db'
import { NextResponse } from 'next/server';

interface Page {
    id: number;
    content: string;
    title: string;
    folderId: number | null;
    userId: number;
    order: number;
}

export async function PUT(req: NextResponse) {
    const pages: Page[] = await req.json();

    try {
        const updatePromises = pages.map((page, index) =>
            prisma.page.update({
                where: { id: page.id },
                data: { order: index }
            })
        );

        await Promise.all(updatePromises);
        return new Response('Page orders updated successfully', { status: 200 });
    } catch (error) {
        console.error('Error updating page orders:', error);
        return new Response('Error updating page orders', { status: 500 });
    }
}