import { cookies } from 'next/headers'

export const getCurrentUserId = async () => {
    const cookieStore = cookies()
    const userId = cookieStore.get('userId')?.value
    return userId ? Number(userId) : undefined
}
