import type { JSONContent } from '@tiptap/react'

export function tiptapToText(content: JSONContent | null | undefined): string {
    if (!content) return ''
    const parts: string[] = []
    extractText(content, parts)
    return parts.join('\n').trim()
}

function extractText(node: JSONContent, parts: string[]): void {
    if (node.type === 'text' && node.text) {
        parts.push(node.text)
        return
    }

    if (node.content) {
        const isBlock = ['paragraph', 'heading', 'blockquote', 'listItem', 'taskItem'].includes(node.type ?? '')
        const childParts: string[] = []
        for (const child of node.content) {
            extractText(child, childParts)
        }
        const joined = childParts.join('')
        if (joined) {
            parts.push(joined)
            if (isBlock) parts.push('')
        }
    }
}

export function textToTiptap(text: string): JSONContent {
    const lines = text.split('\n')
    const content: JSONContent[] = []
    let i = 0

    while (i < lines.length) {
        const trimmed = lines[i].trim()

        if (!trimmed || trimmed === '---') {
            i++
            continue
        }

        if (trimmed.startsWith('#### ')) {
            content.push({ type: 'heading', attrs: { level: 4 }, content: parseInline(trimmed.slice(5)) })
            i++
        } else if (trimmed.startsWith('### ')) {
            content.push({ type: 'heading', attrs: { level: 3 }, content: parseInline(trimmed.slice(4)) })
            i++
        } else if (trimmed.startsWith('## ')) {
            content.push({ type: 'heading', attrs: { level: 2 }, content: parseInline(trimmed.slice(3)) })
            i++
        } else if (trimmed.startsWith('# ')) {
            content.push({ type: 'heading', attrs: { level: 1 }, content: parseInline(trimmed.slice(2)) })
            i++
        } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const items: JSONContent[] = []
            while (i < lines.length) {
                const t = lines[i].trim()
                if (t.startsWith('- ') || t.startsWith('* ')) {
                    items.push({
                        type: 'listItem',
                        content: [{ type: 'paragraph', content: parseInline(t.slice(2)) }],
                    })
                    i++
                } else if (!t) {
                    // skip blank lines inside a list
                    i++
                } else {
                    break
                }
            }
            content.push({ type: 'bulletList', content: items })
        } else if (/^\d+\.\s/.test(trimmed)) {
            const items: JSONContent[] = []
            while (i < lines.length) {
                const t = lines[i].trim()
                const numbered = /^\d+\.\s(.*)/.exec(t)
                if (numbered) {
                    items.push({
                        type: 'listItem',
                        content: [{ type: 'paragraph', content: parseInline(numbered[1]) }],
                    })
                    i++
                } else if (!t) {
                    i++
                } else {
                    break
                }
            }
            content.push({ type: 'orderedList', content: items })
        } else {
            content.push({ type: 'paragraph', content: parseInline(trimmed) })
            i++
        }
    }

    if (content.length === 0) {
        content.push({ type: 'paragraph' })
    }

    return { type: 'doc', content }
}

function parseInline(text: string): JSONContent[] {
    const nodes: JSONContent[] = []
    // Match **bold**, *italic*, and plain text segments
    const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3/g
    let last = 0
    let match: RegExpExecArray | null

    while ((match = regex.exec(text)) !== null) {
        if (match.index > last) {
            nodes.push({ type: 'text', text: text.slice(last, match.index) })
        }
        if (match[1]) {
            nodes.push({ type: 'text', text: match[2], marks: [{ type: 'bold' }] })
        } else if (match[3]) {
            nodes.push({ type: 'text', text: match[4], marks: [{ type: 'italic' }] })
        }
        last = match.index + match[0].length
    }

    if (last < text.length) {
        nodes.push({ type: 'text', text: text.slice(last) })
    }

    return nodes.length > 0 ? nodes : [{ type: 'text', text }]
}
