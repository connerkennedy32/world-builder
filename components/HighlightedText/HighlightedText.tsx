'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const HighlightedText = ({ node }: { node: any }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleMouseEnter = () => {
        setIsHovered(true);
        console.log('Hovered over highlighted text:', node.attrs.text);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        console.log('Stopped hovering over highlighted text:', node.attrs.text);
    };

    const handleClick = () => {
        console.log('Clicked on highlighted text:', node.attrs.text);
        if (isClient) {
            router.push(`/page/${encodeURIComponent(node.attrs.text)}`);
        }
    };

    return (
        <NodeViewWrapper
            style={{ backgroundColor: 'yellow', display: 'inline', cursor: 'pointer' }}
            className="custom-component"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="custom-highlight">{node.attrs.text}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <h3>{node.attrs.text}</h3>
                        <p>This is a test tooltip that contains information about my page</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </NodeViewWrapper>
    )
}

export default HighlightedText;