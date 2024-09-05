import { useMutation } from 'react-query';
import axios from 'axios';
import { TreeItem } from '@/types/itemTypes';

const useSavePageOrder = () => {
    return useMutation(
        async (newOrder: TreeItem[]) => {
            const response = await axios.put('/api/pages/update-pages-order', newOrder, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        },
        {
            onError: (error) => {
                console.error('Failed to update page orders:', error);
            },
        }
    );
};

export default useSavePageOrder;
