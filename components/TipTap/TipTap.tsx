'use client'

import Styles from './styles.module.css'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Mention from '@tiptap/extension-mention'
import { EditorContent, useEditor, BubbleMenu, mergeAttributes } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Mark } from '@tiptap/core'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import suggestion from '../Mentions/suggestion'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'

// const CustomHighlight = Highlight.extend({
//     name: 'test',
//     addNodeView() {
//         return () => {
//             const container = document.createElement('div')

//             container.addEventListener('click', event => {
//                 alert('clicked on the container')
//             })

//             const content = document.createElement('div')
//             container.append(content)

//             return {
//                 dom: container,
//                 contentDOM: content,
//             }
//         }
//     },
// })

// const HighlightedText = Mark.create({
//     name: "comment",
//     addNodeView() {
//         return () => {
//             const container = document.createElement('div')

//             container.addEventListener('click', event => {
//                 alert('clicked on the container')
//                 console.log("HELLO THERE")
//             })

//             const content = document.createElement('div')
//             container.append(content)

//             return {
//                 dom: container,
//                 contentDOM: content,
//             }
//         }
//     },
//     toDOM: () => {
//         return ["span", { class: "highlighted-text" }, 0];
//     },
//     renderHTML({ HTMLAttributes }) {
//         return ["span", mergeAttributes({ class: "highlighted-text" }, HTMLAttributes), 0];
//     },
//     parseHTML() {
//         return [{ tag: "span.highlighted-text" }];
//     },
//     addKeyboardShortcuts() {
//         return {
//             'Mod-l': () => this.editor.chain().focus().toggleMark('comment').run(),
//         }
//     },
// });

// const HoverExtension = Extension.create({
//     name: 'hover',

//     addProseMirrorPlugins() {
//         return [
//             new Plugin({
//                 key: new PluginKey('hover'),
//                 props: {
//                     handleClick: {
//                         mouseover(view, event) {

//                             console.log("HVOERILKSDF", view)
//                             // do whatever you want
//                         }
//                     },
//                 },
//             }),
//         ]
//     },
// })

export default function TipTap({ page_content, page_id }: { page_content: string | null, page_id: string }) {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successfulSubmit, setSuccessfulSubmit] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Typography,
            Mention.configure({
                HTMLAttributes: {
                    class: 'mention'
                },
                // @ts-ignore
                suggestion,
                renderHTML({ options, node }) {
                    return [
                        "a",
                        mergeAttributes({ href: `/profile/${node.attrs.id}` }, options.HTMLAttributes),
                        `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`,
                    ];
                },
            })
        ],
        content: page_content,
    })

    useEffect(() => {
        // this is just an example. do whatever you want to do here
        // to retrieve your editors content from somewhere
        editor?.commands.setContent(page_content)
    }, [editor, page_content])

    const savePage = async (e: { preventDefault: () => void; }) => {
        console.log("Saving page")
        e.preventDefault();
        try {
            setIsSubmitting(true);

            const response = await fetch(`/api?id=${page_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: editor?.getHTML(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            // Handle success, e.g., redirect to another page or update state
            setIsSubmitting(false);
            setSuccessfulSubmit(true);
            console.log('Form submitted successfully');
        } catch (error) {
            setIsSubmitting(false);
            console.error('Error submitting form:', error);
            // Handle error, e.g., show an error message to the user
        }
    };

    return (
        <>

            <div>
                {editor && <BubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
                    <button
                        onClick={() => {
                            editor.chain().focus().toggleMark('highlight').run()
                        }}
                        className={editor.isActive('test') ? 'is-active' : ''}
                    >
                        Create New
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'is-active' : ''}
                    >
                        Italic
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={editor.isActive('strike') ? 'is-active' : ''}
                    >
                        Strike
                    </button>
                </BubbleMenu>}
                <EditorContent editor={editor} />
                <button onClick={savePage}>Save</button>
            </div>
        </>
    )
}
