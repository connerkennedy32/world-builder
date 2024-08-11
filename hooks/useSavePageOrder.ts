import { useMutation } from 'react-query';
import axios from 'axios';
import { Page } from '@/types/pageTypes';

const useSavePageOrder = () => {
    return useMutation(
        async (newOrder: Page[]) => {
            const response = await axios.put('/api/pages/update-pages-order', newOrder, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        },
        {
            onSuccess: (data) => {
                console.log('Order saved:', data);
            },
            onError: (error) => {
                console.error('Failed to update page orders:', error);
            },
        }
    );
};

export default useSavePageOrder;
