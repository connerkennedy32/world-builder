import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import { useQuery } from 'react-query'
import MentionList from './MentionList'

// Create a function to fetch pages that can be used with React Query
const fetchPages = async () => {
    const response = await fetch('/api/pages');
    return response.json();
}

// Create a custom hook to access the pages data
export const usePagesData = () => {
    return useQuery({
        queryKey: ['pages'],
        queryFn: fetchPages,
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
        cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    });
}

// Create a singleton for the query client results
let cachedPages: any[] | null = null;

const suggestion = {
    items: async ({ query }: any) => {
        // If we don't have cached pages yet, fetch them
        if (!cachedPages) {
            const response = await fetch('/api/pages');
            cachedPages = await response.json();
        }
        // Use the cached pages for filtering
        return cachedPages?.filter((item: any) => item.title.toLowerCase().startsWith(query.toLowerCase()))
            .slice(0, 5)
            .map((item: any) => item.title) || [];
    },

    render: () => {
        let component: any
        let popup: { destroy: () => void, setProps: any, hide: any }[]

        return {
            onStart: (props: { editor: any, clientRect: any }) => {
                component = new ReactRenderer(MentionList, {
                    props,
                    editor: props.editor,
                })

                if (!props.clientRect) {
                    return
                }

                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                })
            },

            onUpdate(props: Record<string, any>) {
                component.updateProps(props)

                if (!props.clientRect) {
                    return
                }

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                })
            },

            onKeyDown(props: { event: { key: string } }) {
                if (props.event.key === 'Escape') {
                    popup[0].hide()

                    return true
                }

                return component.ref?.onKeyDown(props)
            },

            onExit() {
                popup?.[0]?.destroy()
                component?.destroy()
            },
        }
    },
}

export default suggestion;