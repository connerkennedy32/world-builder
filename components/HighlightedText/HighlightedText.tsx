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
import useGetPageInfo from '@/hooks/useGetPageInfo';

const HighlightedText = ({ node }: { node: any }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const { data: pageInfo, isLoading: pageInfoLoading } = useGetPageInfo(node.attrs.text);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleMouseEnter = () => {
        setIsHovered(true);
        console.log('Hovered over highlighted text:', pageInfo?.id);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        console.log('Stopped hovering over highlighted text:', node.attrs.text);
    };

    const handleClick = () => {
        console.log('Clicked on highlighted text:', node.attrs.text);
        if (isClient && pageInfo?.id) {
            router.push(`/page/${pageInfo.id}`);
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
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="custom-highlight">{node.attrs.text}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <h3>{node.attrs.text}</h3>
                        {pageInfoLoading ? <p>Loading...</p> : <p>{pageInfo?.id}</p>}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </NodeViewWrapper>
    )
}

export default HighlightedText;