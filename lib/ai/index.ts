import { ClaudeProvider } from './claude'
import { OpenAIProvider } from './openai'
import type { AIProvider } from './types'

export type ProviderName = 'claude' | 'openai'

export function getProvider(name: ProviderName = 'claude'): AIProvider {
    if (name === 'openai') return new OpenAIProvider()
    return new ClaudeProvider()
}

export type { AIProvider, ChatMessage } from './types'
