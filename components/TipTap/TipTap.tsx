'use client'

import Styles from './styles.module.css'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import { EditorContent, useEditor, BubbleMenu, FloatingMenu, ReactNodeViewRenderer } from '@tiptap/react'
import { EditorState } from 'prosemirror-state';
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useState, useContext, useRef } from 'react'
import suggestion from '../Mentions/suggestion'
import { useDebounce } from 'use-debounce';
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { useUpdatePage } from '@/hooks';
import { GlobalContext } from '../GlobalContextProvider';
import { useSidebar } from '../ui/sidebar'
import { CustomMentionExtension } from './extensions/MentionExtenstion';
import { Sparkles, CornerDownLeft } from 'lucide-react';
import { tiptapToText, textToTiptap } from '@/lib/tiptap-to-text';

export default function TipTap({ page_content, page_id }: { page_content: JSON | null, page_id: string }) {
    const { state: sidebarState } = useSidebar();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiGenerating, setAiGenerating] = useState(false);
    const aiInputRef = useRef<HTMLTextAreaElement>(null);
    const { selectedItemId, setAiPanelOpen, aiPanelOpen } = useContext(GlobalContext);
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

    const generateAndAppend = async () => {
        const prompt = aiPrompt.trim();
        if (!prompt || aiGenerating || !editor) return;

        setAiGenerating(true);
        setAiPrompt('');

        const pageContent = tiptapToText(editor.getJSON());

        let accumulated = '';
        try {
            const res = await fetch('/api/ai/page-append', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, pageContent }),
            });

            if (!res.ok || !res.body) throw new Error('Failed');

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                accumulated += decoder.decode(value, { stream: true });
            }

            const newNodes = textToTiptap(accumulated);
            editor.chain().focus().insertContentAt(editor.state.doc.content.size, newNodes.content ?? []).run();
            savePage();
        } catch {
            setAiPrompt(prompt); // restore on error
        } finally {
            setAiGenerating(false);
        }
    };

    if (selectedItemId !== page_id) {
        return null;
    }

    return (
        <div id="tiptap-editor" className={sidebarState === "expanded" ? Styles.containerDrawerOpen : Styles.containerDrawerClosed}>
            <button
                onClick={() => setAiPanelOpen(true)}
                className={Styles.aiButton}
                style={{ right: aiPanelOpen ? 'calc(420px + 1rem)' : '1rem', transition: 'right 0.3s ease' }}
                title="Story Assistant"
            >
                <Sparkles size={16} />
            </button>
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

                <div className={Styles.aiPromptBar}>
                    <Sparkles size={13} className={Styles.aiPromptIcon} />
                    <textarea
                        ref={aiInputRef}
                        value={aiPrompt}
                        onChange={(e) => {
                            setAiPrompt(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                generateAndAppend();
                            }
                        }}
                        placeholder={aiGenerating ? 'Generating…' : 'Ask AI to add to this page…'}
                        disabled={aiGenerating}
                        rows={1}
                        className={Styles.aiPromptInput}
                    />
                    {aiPrompt.trim() && !aiGenerating && (
                        <button onClick={generateAndAppend} className={Styles.aiPromptSubmit} title="Generate (Enter)">
                            <CornerDownLeft size={13} />
                        </button>
                    )}
                    {aiGenerating && (
                        <div className={Styles.aiPromptSpinner} />
                    )}
                </div>
            </div>
        </div>
    )
}