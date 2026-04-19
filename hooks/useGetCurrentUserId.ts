import { useState, useEffect } from 'react'

export const useGetCurrentUserId = () => {
    const [userId, setUserId] = useState<number | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem('userId')
        if (stored) setUserId(Number(stored))
    }, [])

    return userId
}
