import { prisma } from '@/backend/db'
import { getCurrentUserId } from '@/app/utils/userUtils'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    const userId = await getCurrentUserId()
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const item = await prisma.item.findFirst({
        where: { id: params.id, userId },
        select: { id: true, title: true, content: true },
    })

    if (!item) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(item)
}
