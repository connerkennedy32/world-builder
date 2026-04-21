import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import type { AIProvider, ChatMessage } from './types'

// Prices per million tokens
const PRICING: Record<string, { input: number; cachedInput: number | null; output: number }> = {
    'gpt-5':      { input: 1.25, cachedInput: 0.125, output: 10.00 },
    'gpt-5-mini': { input: 0.25, cachedInput: 0.025, output: 2.00 },
}

function calcCost(model: string, promptTokens: number, cachedTokens: number, completionTokens: number): string | null {
    const pricing = PRICING[model]
    if (!pricing) return null
    const uncachedTokens = promptTokens - cachedTokens
    const cachedCost = pricing.cachedInput !== null ? (cachedTokens / 1_000_000) * pricing.cachedInput : (cachedTokens / 1_000_000) * pricing.input
    const inputCost = (uncachedTokens / 1_000_000) * pricing.input
    const outputCost = (completionTokens / 1_000_000) * pricing.output
    return `$${(inputCost + cachedCost + outputCost).toFixed(6)}`
}

export class OpenAIProvider implements AIProvider {
    name = 'openai'

    async streamChat(messages: ChatMessage[], systemPrompt: string, model = 'gpt-4o-mini'): Promise<ReadableStream<Uint8Array>> {
        const encoder = new TextEncoder()

        const result = await streamText({
            model: openai(model),
            system: systemPrompt,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            maxTokens: 16384,
        })

        Promise.all([result.usage, result.experimental_providerMetadata]).then(([usage, meta]) => {
            const cachedTokens = (meta?.openai as any)?.cachedPromptTokens ?? 0
            const cost = calcCost(model, usage.promptTokens, cachedTokens, usage.completionTokens)
            console.log(`[OpenAI] model=${model} prompt=${usage.promptTokens} (cached=${cachedTokens}) completion=${usage.completionTokens}${cost ? ` cost=${cost}` : ''}`)
        }).catch(() => {})

        return new ReadableStream({
            async start(controller) {
                try {
                    for await (const text of result.textStream) {
                        controller.enqueue(encoder.encode(text))
                    }
                    controller.close()
                } catch (err) {
                    controller.error(err)
                }
            },
        })
    }
}
