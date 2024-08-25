'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import useGetPageInfo from '@/hooks/useGetPageInfo';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography';
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import CustomComponentExtension from '@/components/TipTap/extensions/CustomComponent';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

const HighlightedText = ({ node }: { node: any }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();
    const { data: pageInfo, isLoading: pageInfoLoading } = useGetPageInfo(node.attrs.text);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Typography,
            Highlight,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            CustomComponentExtension,
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'tiptap-dialog',
            },
        },
        editable: false,
    })

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (pageInfo?.content && editor) {
            editor.commands.setContent(pageInfo.content);
        }
    }, [pageInfo, editor]);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleWordClick = () => {
        if (isClient && pageInfo?.id) {
            router.push(`/page/${pageInfo.id}`);
        }
    };

    const handlePopoverClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDialogOpen(true);
    };

    return (
        <NodeViewWrapper
            style={{ backgroundColor: 'yellow', display: 'inline', cursor: 'pointer' }}
            className="custom-component"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span onClick={handleWordClick} className="custom-highlight">{node.attrs.text}</span>
                    </TooltipTrigger>
                    <TooltipContent
                        onMouseDown={handlePopoverClick}
                    >
                        <h3 className="text-lg font-semibold mb-2">{node.attrs.text}</h3>
                        {pageInfoLoading ? <p>Loading...</p> : <p className="text-sm">{pageInfo?.id}</p>}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <VisuallyHidden.Root>
                        <DialogHeader>
                            <DialogTitle>Hidden</DialogTitle>
                            <DialogDescription>
                                Hidden
                            </DialogDescription>
                        </DialogHeader>
                    </VisuallyHidden.Root>
                    <EditorContent editor={editor} />
                </DialogContent>
            </Dialog>
        </NodeViewWrapper >
    )
}

export default HighlightedText;