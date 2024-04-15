'use client'

import Styles from './styles.module.css'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Mention from '@tiptap/extension-mention'
import { EditorContent, useEditor, BubbleMenu, mergeAttributes } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Mark } from '@tiptap/core'
import React from 'react'
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

const TipTap = () => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Typography,
            Mention.configure({
                HTMLAttributes: {
                    class: 'mention'
                },
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
        content: `
        <h1>Test Header</h1><p>To test that, start a new line and type <code>#</code> followed by a space to get a heading. Try <code>#</code>, <code>##</code>, <code>###</code>, <code>####</code>, <code>#####</code>, <code>######</code> for different levels.</p><p>Those conventions are called input rules in tiptap. Some of the<strong>m are enabled by </strong>default. Try <code>&gt;</code> for blockquotes, <code>*</code>, <code>-</code> or <code>+</code> for bullet lists, or <code>foobar</code> to highlight code, <code>~~tildes~~</code> to strike text, or <code>==equal signs==</code> to highlight text.</p><blockquote><p>What ist thisalfksajc FKLDSJF LISDUF JLSKDJFL<strong>KSDJFLSKDJFKLSDJFf</strong></p><p>flskdafjasdlkfjasdlkfkjasf</p></blockquote><ul><li><p></p></li><li><p>asdfasdf</p></li><li><p>sadf</p></li><li><p></p></li><li><p>asdf</p></li><li><p>sadfsadfas</p></li><li><p>df</p></li><li><p>asdfsadfsa</p></li><li><p>fsadf</p></li><li><p>walkdsfaslkdf</p></li><li><p>asdfklasdjflasdf</p></li></ul><h2>THwlkajsdflkasdjfasdf</h2><p>You can overwrite existing input rules or add your <strong>own to</strong> nodes, marks and extensions.</p><p>For example, we added the <code>Typography</code> extension here. Try typing <code>(c)</code> to see how it’s converted to a proper © character. You can also try <code>-&gt;</code>, <code>&gt;&gt;</code>, <code>1/2</code>, <code>!=</code>, or <code>--</code>.</p> `,
    })

    return (
        <>
            <div className={Styles.columns}>
                <div className={Styles.navigation}>
                    <h1 className={Styles.header}>Navigation</h1>
                    <Link style={{ textDecoration: 'none', color: 'black' }} href={'/isaac'}>
                        <p className={Styles.rowElement}>Isaac</p>
                    </Link>
                    <p className={Styles.rowElement}>Nicole</p>
                    <p className={Styles.rowElement}>Freedom Fields</p>
                    <p className={Styles.rowElement}>Tyrannus</p>
                    <p className={Styles.rowElement}>Samuel</p>
                    <p className={Styles.rowElement}>Rose</p>
                </div>
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
                </div>
            </div>
        </>
    )
}

export default TipTap;
