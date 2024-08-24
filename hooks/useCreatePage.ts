import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const createPage = async (title: string) => {
    const response = await axios.post('/api', { title }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

const useCreatePage = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (title: string) => {
            const response = await createPage(title);
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