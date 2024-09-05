import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const createPage = async (id: string | null, title: string, parentId: string | null, index: number) => {
    const response = await axios.post('/api/pages', { id, title, parentId, index }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

const useCreatePage = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async (variables: { id: string | null, title: string; parentId: string | null; index: number }) => {
            const { id, title, parentId, index } = variables;
            const response = await createPage(id, title, parentId, index);
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('pageList');
            },
            onError: (error) => {
                console.error('Failed to create page:', error);
            },
        }
    );
};

export default useCreatePage;