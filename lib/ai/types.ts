export interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

export interface AIProvider {
    name: string
    streamChat(
        messages: ChatMessage[],
        systemPrompt: string,
        model?: string,
    ): Promise<ReadableStream<Uint8Array>>
}
