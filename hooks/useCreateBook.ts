import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Book } from '@prisma/client';

interface CreateBookData {
    title: string;
    goalWordCount?: number;
    author?: string;
}

const useCreateBook = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (data: CreateBookData) => {
            const response = await axios.post('/api/books', data);
            return response.data as Book;
        },
        {
            onSuccess: () => {
                // Invalidate and refetch the bookList query
                queryClient.invalidateQueries('bookList');
            },
            onError: (error) => {
                console.error('Error creating new book:', error);
            },
        }
    );
};

export default useCreateBook; 