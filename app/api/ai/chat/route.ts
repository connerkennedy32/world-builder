import { prisma } from '../../../../backend/db'
import { getCurrentUserId } from '@/app/utils/userUtils'
import { tiptapToText } from '@/lib/tiptap-to-text'
import { getProvider } from '@/lib/ai'
import type { ChatMessage } from '@/lib/ai'
import type { JSONContent } from '@tiptap/react'

export async function POST(req: Request) {
    const userId = await getCurrentUserId()
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { message, currentPageContent, history = [], provider = 'claude', model, pinnedPagesContent = [] } = await req.json()

    if (!message?.trim()) {
        return Response.json({ error: 'Message is required' }, { status: 400 })
    }

    // Load world context
    const worldContextItem = await prisma.item.findFirst({
        where: { userId, isWorldContext: true },
    })
    const worldContextText = worldContextItem
        ? tiptapToText(worldContextItem.content as JSONContent | null)
        : null

    const systemParts: string[] = [
        'You are a creative writing thought partner for a fiction writer. Your role is to help them develop their story, characters, world, and prose.',
        '',
        'Be specific, imaginative, and tailored to their story. Give concrete suggestions, not generic advice. When asked for ideas, offer multiple options. When asked to help finish something, produce actual draft text.',
    ]

    if (worldContextText) {
        systemParts.push('', '---', '## World Context', '', worldContextText)
    }

    for (const page of pinnedPagesContent as { title: string; content: string }[]) {
        if (page.content) {
            systemParts.push('', '---', `## ${page.title}`, '', page.content)
        }
    }

    if (currentPageContent) {
        systemParts.push('', '---', '## Current Page the Writer is Working On', '', currentPageContent)
    }

    const systemPrompt = systemParts.join('\n')

    const messages: ChatMessage[] = [
        ...history,
        { role: 'user', content: message },
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
