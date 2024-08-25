import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import HighlightedText from '../../HighlightedText/HighlightedText';

const CustomComponentExtension = Node.create({
    name: 'customComponent',
    group: 'inline',
    inline: true,
    atom: true,

    addAttributes() {
        return {
            text: {
                default: '',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-type="custom-component"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', { 'data-type': 'custom-component', ...HTMLAttributes }, 0];
    },

    addNodeView() {
        return ReactNodeViewRenderer(HighlightedText);
    },
});

export default CustomComponentExtension;