import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '../../backend/db'

export const getCurrentUserId = async () => {
    const user = await currentUser()
    const userId = await prisma.user.findUnique({
        where: {
            clerkId: user?.id,
        },
    })
    return userId?.id;
}