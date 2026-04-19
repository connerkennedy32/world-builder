import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import type { AIProvider, ChatMessage } from './types'

export class OpenAIProvider implements AIProvider {
    name = 'openai'

    async streamChat(messages: ChatMessage[], systemPrompt: string, model = 'gpt-4o-mini'): Promise<ReadableStream<Uint8Array>> {
        const encoder = new TextEncoder()

        const result = await streamText({
            model: openai(model),
            system: systemPrompt,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            maxTokens: 16000,
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
