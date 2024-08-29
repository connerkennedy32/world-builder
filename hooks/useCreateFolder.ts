import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const createFolder = async (title: string, folderId?: number, order?: number, nestedOrder?: number) => {
    const response = await axios.post('/api/folders', { title, folderId, order, nestedOrder }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

const useCreateFolder = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async (variables: { title: string; folderId?: number; order?: number; nestedOrder?: number }) => {
            const { title, folderId, order, nestedOrder } = variables;
            const response = await createFolder(title, folderId, order, nestedOrder);
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