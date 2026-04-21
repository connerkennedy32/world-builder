import { useState } from 'react'

export const useGetCurrentUserId = () => {
    const [userId] = useState<number | null>(() => {
        if (typeof window === 'undefined') return null
        const stored = localStorage.getItem('userId')
        return stored ? Number(stored) : null
    })

    return userId
}
