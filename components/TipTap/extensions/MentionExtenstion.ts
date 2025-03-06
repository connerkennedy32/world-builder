import { Mention } from '@tiptap/extension-mention';
import { ReactNodeViewRenderer } from '@tiptap/react';
import HighlightedText from '@/components/HighlightedText/HighlightedText';

export const CustomMentionExtension = Mention.extend({
    addNodeView() {
        return ReactNodeViewRenderer(HighlightedText);
    },
});