'use client'

import { useContext } from 'react'
import { GlobalContext } from '@/components/GlobalContextProvider'

export function MainContentWrapper({ children }: { children: React.ReactNode }) {
    const { aiPanelOpen } = useContext(GlobalContext)

    return (
        <div
            className="flex-1 min-w-0 transition-[margin-right] duration-300 ease-in-out"
            style={{ marginRight: aiPanelOpen ? 420 : 0 }}
        >
            {children}
        </div>
    )
}
