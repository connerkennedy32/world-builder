import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'

import MentionList from './MentionList'
import { RefAttributes } from 'react'

const suggestion = {
    items: ({ query }: any) => {
        return [
            'Lea Thompson',
            'Cyndi Lauper',
            'Tom Cruise',
            'Madonna',
            'Jerry Hall',
            'Joan Collins',
            'Winona Ryder',
            'Christina Applegate',
            'Alyssa Milano',
            'Molly Ringwald',
            'Ally Sheedy',
            'Debbie Harry',
            'Olivia Newton-John',
            'Elton John',
            'Michael J. Fox',
            'Axl Rose',
            'Emilio Estevez',
            'Ralph Macchio',
            'Rob Lowe',
            'Jennifer Grey',
            'Mickey Rourke',
            'John Cusack',
            'Matthew Broderick',
            'Justine Bateman',
            'Lisa Bonet',
            'Issac Character'
        ]
            .filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
            .slice(0, 5)
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