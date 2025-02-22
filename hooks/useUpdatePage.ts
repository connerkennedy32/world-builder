import { useMutation } from 'react-query';
import axios from 'axios';
import { JSONContent } from '@tiptap/react';
import { useQueryClient } from 'react-query';

const updatePage = async (page_id: string, title?: string, content?: JSONContent, order?: number, parentId?: number) => {
    const response = await axios.put(`/api/pages/${page_id}`, {
        title: title,
        content: content,
        order: order,
        parentId: parentId,
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

const useUpdatePage = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ page_id, title, content, order, parentId }: { page_id: string; title?: string; content?: JSONContent; order?: number; parentId?: number }) => {
            const response = await updatePage(page_id, title, content, order, parentId);
            return response.data;
        },
        {
            onSuccess: (_, variables) => {
                queryClient.removeQueries({ queryKey: ['page', variables.page_id] });
            },
            onError: (error) => {
                console.error('Failed to save page:', error);
            },
        }
    );
};

export default useUpdatePage;
