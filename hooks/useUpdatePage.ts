import { useMutation } from 'react-query';
import axios from 'axios';
import { JSONContent } from '@tiptap/react';

const updatePage = async (page_id: string, title?: string, content?: JSONContent, order?: number, nestedOrder?: number, folderId?: number) => {
    const response = await axios.put(`/api/pages/${page_id}`, {
        title: title,
        content: content,
        order: order,
        nestedOrder: nestedOrder,
        folderId: folderId,
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

const useUpdatePage = () => {
    return useMutation(
        async ({ page_id, title, content, order, nestedOrder, folderId }: { page_id: string; title?: string; content?: JSONContent; order?: number; nestedOrder?: number; folderId?: number }) => {
            const response = await updatePage(page_id, title, content, order, nestedOrder, folderId);
            return response.data;
        },
        {
            onError: (error) => {
                console.error('Failed to save page:', error);
            },
        }
    );
};

export default useUpdatePage;
