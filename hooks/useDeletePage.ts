import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const deletePage = async (id: string) => {
    const response = await axios.delete(`/api/pages/${id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

const useDeletePage = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (id: string) => {
            const response = await deletePage(id);
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('pageList');
            },
            onError: (error) => {
                console.error('Failed to delete page:', error);
            },
        }
    );
};

export default useDeletePage;
