import { prisma } from '@/backend/db'
import { getCurrentUserId } from '@/app/utils/userUtils'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const viewAll = searchParams.get('viewAll') === 'true'

    const userId = await getCurrentUserId()

    let whereClause = {}
    if (!viewAll && userId) {
        whereClause = { userId: userId }
    }

    const books = await prisma.book.findMany({
        where: whereClause
    })

    return Response.json(books);
}