import { useMutation } from 'react-query';
import axios from 'axios';
import { JSONContent } from '@tiptap/react';

const savePageContent = async (page_id: string, content: JSONContent) => {
    const response = await axios.put(`/api?id=${page_id}`, {
        content: content,
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

const useSavePageContent = () => {
    return useMutation(
        async ({ page_id, content }: { page_id: string; content: JSONContent }) => {
            const response = await savePageContent(page_id, content);
            return response.data;
        },
        {
            onError: (error) => {
                console.error('Failed to save page:', error);
            },
        }
    );
};

export default useSavePageContent;
