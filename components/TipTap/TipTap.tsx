'use client'

import Styles from './styles.module.css'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import { EditorContent, useEditor, BubbleMenu, FloatingMenu, ReactNodeViewRenderer } from '@tiptap/react'
import { EditorState } from 'prosemirror-state';
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useState, useContext } from 'react'
import suggestion from '../Mentions/suggestion'
import { useDebounce } from 'use-debounce';
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { useUpdatePage } from '@/hooks';
import { GlobalContext } from '../GlobalContextProvider';
import { useSidebar } from '../ui/sidebar'
import { CustomMentionExtension } from './extensions/MentionExtenstion';

export default function TipTap({ page_content, page_id }: { page_content: JSON | null, page_id: string }) {
    const { state: sidebarState } = useSidebar();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const { selectedItemId } = useContext(GlobalContext);
    const { mutate: savePageContent, isSuccess: isPageSaveSuccess } = useUpdatePage();

    useEffect(() => {
        return () => {
            if (hasUnsavedChanges) {
                savePage();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page_id, hasUnsavedChanges]);

    useEffect(() => {
        if (isPageSaveSuccess) {
            setHasUnsavedChanges(false);
        }
    }, [isPageSaveSuccess]);

    useEffect(() => {
        const handleBeforeUnload = (event: { preventDefault: () => void; returnValue: string }) => {
            if (hasUnsavedChanges) {
                event.preventDefault();
                event.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);


    const editor = useEditor({
        extensions: [
            StarterKit,
            Typography,
            Highlight,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            CustomMentionExtension.configure({
                // @ts-ignore
                suggestion,
            }),
        ],
        content: page_content,
        editorProps: {
            attributes: {
                class: 'tiptap',
            },
        },
        onUpdate: () => {
            setHasUnsavedChanges(true);
        }
    })

    const [debouncedEditor] = useDebounce(editor?.state.doc.content, 5000);

    useEffect(() => {
        if (debouncedEditor) {
            console.log('Saving page...');
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

    const resetEditorContent = (newContent: JSON | null) => {
        editor?.commands.setContent(newContent);

        // The following code clears the history. Hopefully without side effects.
        const newEditorState = EditorState.create({
            doc: editor?.state.doc,
            plugins: editor?.state.plugins,
            schema: editor?.state.schema
        });
        editor?.view.updateState(newEditorState);
    }

    const savePage = () => {
        savePageContent({ page_id, content: editor?.getJSON() || {} });
    };

    if (selectedItemId !== page_id) {
        return null;
    }

    return (
        <div id="tiptap-editor" className={sidebarState === "expanded" ? Styles.containerDrawerOpen : Styles.containerDrawerClosed}>
            <div className={`${Styles.content}`}>
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