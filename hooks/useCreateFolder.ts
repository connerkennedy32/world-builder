import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const createFolder = async (id: string | null, title: string, parentId: string | null, index: number) => {
    const response = await axios.post('/api/folders', { id, title, parentId, index }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

const useCreateFolder = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async (variables: { id: string | null, title: string; parentId: string | null; index: number }) => {
            const { id, title, parentId, index } = variables;
            const response = await createFolder(id, title, parentId, index);
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('pageList');
            },
            onError: (error) => {
                console.error('Failed to create folder:', error);
            },
        }
    );
};

export default useCreateFolder;