import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

interface WordEntryData {
    date: string;
    wordCount: number;
    bookId?: number;
}

const useCreateNewWordEntry = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (data: WordEntryData) => {
            const response = await axios.post('/api/books/wordCount', data);
            return response.data;
        },
        {
            onSuccess: () => {
                // Invalidate and refetch the wordCountList query
                queryClient.invalidateQueries('wordCountList');
            },
            onError: (error) => {
                console.error('Error creating new word entry:', error);
            },
        }
    );
};

export default useCreateNewWordEntry;
