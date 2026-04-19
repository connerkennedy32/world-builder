import { prisma } from '../../../backend/db'
import { getCurrentUserId } from '@/app/utils/userUtils'
import { tiptapToText, textToTiptap } from '@/lib/tiptap-to-text'
import { getProvider } from '@/lib/ai'
import type { JSONContent } from '@tiptap/react'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
    const userId = await getCurrentUserId()
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const item = await prisma.item.findFirst({
        where: { userId, isWorldContext: true },
    })

    return Response.json({ item })
}

export async function POST(req: Request) {
    const userId = await getCurrentUserId()
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const provider = body.provider ?? 'claude'
    const model: string | undefined = body.model
    const draftText: string | undefined = body.draftText

    let pageTexts: string

    if (draftText) {
        pageTexts = draftText.trim()
        if (!pageTexts) {
            return Response.json({ error: 'Draft text is empty' }, { status: 400 })
        }
    } else {
        // Fetch all pages for context
        const pages = await prisma.item.findMany({
            where: { userId, itemType: 'PAGE', isWorldContext: false },
        })

        pageTexts = pages
            .map(p => {
                const text = tiptapToText(p.content as JSONContent | null)
                return text ? `## ${p.title}\n${text}` : null
            })
            .filter(Boolean)
            .join('\n\n---\n\n') as string

        if (!pageTexts) {
            return Response.json({ error: 'No pages found to generate world context from' }, { status: 400 })
        }
    }

    const systemPrompt = `You are a world-building assistant. Your task is to read through a writer's story pages and extract a comprehensive, structured "World Context" document. This document will be injected as background context every time an AI assistant helps the writer, so it must be exhaustive — missing a character, event, or rule will cause the AI to give inconsistent help.

Create a detailed markdown document with the following sections. Include every named person, place, object, and event you can find. Do not summarize away details — preserve specific names, dates, descriptions, and relationships exactly as written.

## Story Overview
- Genre and sub-genre
- Narrative tone (dark, humorous, literary, etc.)
- Central premise and core conflict
- Major themes
- Point of view / narrative perspective
- Time span covered by the story

## Characters
For EVERY named character (major, minor, and mentioned-only), include:
- **Full name** (and any aliases, titles, or nicknames)
- Physical description (age, appearance, distinguishing features)
- Role in the story (protagonist, antagonist, supporting, etc.)
- Personality traits and voice
- Backstory and history relevant to the plot
- Goals, motivations, and fears
- Key relationships with other characters (specify the nature: ally, rival, family, romantic, etc.)
- Current status and arc trajectory
- Notable quotes or speech patterns if distinctive

## Relationships Map
- List all significant relationships as pairs: Character A ↔ Character B — [relationship type and dynamic]
- Note any conflicts, loyalties, secrets, or power dynamics between characters

## Settings & Locations
For EVERY named location:
- Name and type (city, building, region, world, etc.)
- Physical description and atmosphere
- Significance to the plot
- Who lives/works/frequents there
- Any notable history or lore tied to it

## Timeline of Events
- A chronological list of all major events that have already occurred (before or during the story)
- Include dates or relative timing where available
- Note cause-and-effect chains between events

## Plot Threads & Story Arcs
- Main plot: current state and key beats so far
- Each subplot or secondary arc: what it is, who's involved, current status
- Unresolved conflicts and open questions the story is building toward
- Foreshadowing or planted details mentioned

## World Rules & Lore
- Any magic system, technology, or speculative elements — their rules, limits, and costs
- Social structures, governments, factions, or organizations
- Cultural norms, taboos, religions, or belief systems
- Economic systems or power structures
- Historical background of the world

## Objects & Artifacts
- Any significant named objects, weapons, items, or MacGuffins
- Their properties, history, and current whereabouts/owner

## Recurring Motifs & Symbols
- Symbols, images, or phrases that recur and carry thematic weight

## Continuity Notes
- Specific facts that must stay consistent (e.g., character ages, distances, dates, established rules)
- Any contradictions or ambiguities found in the source material (flag these explicitly)

Be exhaustive. If a character appears in a single sentence, still log them. If a location is mentioned once, still document it. The writer will rely on this document to maintain perfect consistency across future writing sessions.`

    const userMessage = `Here are my story pages:\n\n${pageTexts}\n\nPlease create a comprehensive World Context document covering every character, location, event, and detail you can find.`

    const aiProvider = getProvider(provider as 'claude' | 'openai')

    // Stream the generation and accumulate the full text
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    let fullText = ''
    const upstream = await aiProvider.streamChat([{ role: 'user', content: userMessage }], systemPrompt, model)

    const transformStream = new TransformStream({
        transform(chunk, controller) {
            const text = decoder.decode(chunk)
            fullText += text
            controller.enqueue(chunk)
        },
        async flush() {
            // Save to DB once streaming completes
            const tiptapContent = textToTiptap(fullText)

            // Also write a local .md backup
            const mdPath = join(process.cwd(), 'world-context.md')
            await writeFile(mdPath, fullText, 'utf-8').catch(() => {})
            const existing = await prisma.item.findFirst({
                where: { userId, isWorldContext: true },
            })

            if (existing) {
                await prisma.item.update({
                    where: { id: existing.id },
                    data: { content: tiptapContent, title: 'World Context' },
                })
            } else {
                const maxIndex = await prisma.item.aggregate({
                    where: { userId },
                    _max: { index: true },
                })
                await prisma.item.create({
                    data: {
                        itemType: 'PAGE',
                        title: 'World Context',
                        content: tiptapContent,
                        userId,
                        isWorldContext: true,
                        index: (maxIndex._max.index ?? 0) + 1,
                        parentId: null,
                    },
                })
            }
        },
    })

    upstream.pipeThrough(transformStream)

    return new Response(transformStream.readable, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
        },
    })
}
