import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import type { AIProvider, ChatMessage } from './types'

export class ClaudeProvider implements AIProvider {
    name = 'claude'

    async streamChat(messages: ChatMessage[], systemPrompt: string, model = 'claude-sonnet-4-6'): Promise<ReadableStream<Uint8Array>> {
        const encoder = new TextEncoder()

        const result = await streamText({
            model: anthropic(model),
            system: systemPrompt,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            maxTokens: 64000,
        })

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
