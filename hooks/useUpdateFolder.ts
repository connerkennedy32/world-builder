import { useMutation } from 'react-query';
import axios from 'axios';
import { useQueryClient } from 'react-query';

const updateFolder = async (folderId: string, title?: string, order?: number, nestedOrder?: number, parentId?: number) => {
    const response = await axios.put(`/api/folders/${folderId}`, {
        title: title,
        order: order,
        nestedOrder: nestedOrder,
        parentId: parentId,
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

const useUpdateFolder = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ folderId, title, order, nestedOrder, parentId }: { folderId: string; title?: string; order?: number; nestedOrder?: number; parentId?: number }) => {
            const response = await updateFolder(folderId, title, order, nestedOrder, parentId);
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('pageList');
            },
            onError: (error) => {
                console.error('Failed to save folder:', error);
            },
        }
    );
};

export default useUpdateFolder;
