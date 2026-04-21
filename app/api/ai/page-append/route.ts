import { getCurrentUserId } from '@/app/utils/userUtils'
import { getProvider } from '@/lib/ai'
import type { ChatMessage } from '@/lib/ai'

export async function POST(req: Request) {
    const userId = await getCurrentUserId()
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { prompt, pageContent, provider = 'openai', model } = await req.json()

    if (!prompt?.trim()) {
        return Response.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const systemPrompt = [
        'You are a creative writing assistant adding content to an existing page.',
        '',
        'Rules:',
        '- Match the existing page\'s style, tone, voice, and format exactly.',
        '- If it uses headers, use headers. If it\'s prose, write prose. If it\'s a structured list, extend that list.',
        '- Output only the new content to append — never explain, summarize, or add preamble.',
        '- Do not repeat content already on the page.',
        pageContent
            ? `\n---\n## Existing Page Content\n\n${pageContent}`
            : '',
    ].join('\n')

    const messages: ChatMessage[] = [
        { role: 'user', content: prompt },
    ]

    const aiProvider = getProvider(provider as 'claude' | 'openai')
    const stream = await aiProvider.streamChat(messages, systemPrompt, model)

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
        },
    })
}
