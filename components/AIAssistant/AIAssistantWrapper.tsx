'use client'

import { useContext } from 'react'
import { AnimatePresence } from 'framer-motion'
import { GlobalContext } from '@/components/GlobalContextProvider'
import { AIAssistant } from './AIAssistant'

export function AIAssistantWrapper() {
    const { aiPanelOpen, setAiPanelOpen } = useContext(GlobalContext)

    return (
        <AnimatePresence>
            {aiPanelOpen && (
                <AIAssistant onClose={() => setAiPanelOpen(false)} />
            )}
        </AnimatePresence>
    )
}
