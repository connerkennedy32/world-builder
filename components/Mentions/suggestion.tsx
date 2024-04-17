import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'

import MentionList from './MentionList'
import { RefAttributes } from 'react'

const suggestion = {
    items: async ({ query }: any) => {
        const response = await fetch('/api');
        const data = await response.json();

        return data
            .filter((item: any) => item.title.toLowerCase().startsWith(query.toLowerCase()))
            .slice(0, 5)
            .map((item: any) => item.title);
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
                popup[0].destroy()
                component.destroy()
            },
        }
    },
}

export default suggestion;