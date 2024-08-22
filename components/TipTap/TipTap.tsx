'use client'

import Styles from './styles.module.css'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Mention from '@tiptap/extension-mention'
import { EditorContent, useEditor, BubbleMenu, mergeAttributes, FloatingMenu } from '@tiptap/react'
import { EditorState } from 'prosemirror-state';
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useState } from 'react'
import suggestion from '../Mentions/suggestion'
import { useDebounce } from 'use-debounce';
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'

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
    // TODO: I need the ability to create a new component from highlighted text
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successfulSubmit, setSuccessfulSubmit] = useState(false);


    const editor = useEditor({
        extensions: [
            StarterKit,
            Typography,
            Highlight,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Mention.configure({
                HTMLAttributes: {
                    class: 'mention'
                },
                // @ts-ignore
                suggestion,
                // renderHTML({ options, node }) {
                //     return [
                //         "a",
                //         mergeAttributes({ href: `/profile/${node.attrs.id}` }, options.HTMLAttributes),
                //         `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`,
                //     ];
                // },
            })
        ],
        content: page_content,
        editorProps: {
            attributes: {
                class: 'tiptap',
            },
        },
    })

    const [debouncedEditor] = useDebounce(editor?.state.doc.content, 3000);

    useEffect(() => {
        if (debouncedEditor) {
            savePage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedEditor]);

    useEffect(() => {
        if (editor) {
            resetEditorContent(page_content)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor, page_content])

    function resetEditorContent(newContent: string | null) {
        editor?.commands.setContent(newContent);

        // The following code clears the history. Hopefully without side effects.
        const newEditorState = EditorState.create({
            doc: editor?.state.doc,
            plugins: editor?.state.plugins,
            schema: editor?.state.schema
        });
        editor?.view.updateState(newEditorState);
    }

    const savePage = async () => {
        console.log("Saving page")
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
        <div className={Styles.container}>
            <div className={Styles.content}>
                {editor && <BubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
                    <button
                        onClick={() => {
                            editor.chain().focus().toggleMark('highlight').run()
                        }}
                        className={editor.isActive('highlight') ? 'is-active' : ''}
                    >
                        Highlight
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
                    <button
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                        className={editor.isActive('taskList') ? 'is-active' : ''}
                    >
                        Tasks
                    </button>
                </BubbleMenu>}
                {editor && <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                    >
                        h1
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                    >
                        h2
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                        className={editor.isActive('taskList') ? 'is-active' : ''}
                    >
                        Tasks
                    </button>
                </FloatingMenu>}
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}