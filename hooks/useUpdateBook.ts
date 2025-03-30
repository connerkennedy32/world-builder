import { useMutation } from 'react-query';
import axios from 'axios';
import { useQueryClient } from 'react-query';
import { useToast } from '@/hooks/use-toast';

const updateBook = async (bookId: string, data: { title?: string; author?: string; goalWordCount?: number }) => {
    const response = await axios.put(`/api/books/${bookId}`, data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

const useUpdateBook = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation(
        async ({ bookId, title, author, goalWordCount }: {
            bookId: string;
            title?: string;
            author?: string;
            goalWordCount?: number
        }) => {
            const response = await updateBook(bookId, { title, author, goalWordCount });
            return response.data;
        },
        {
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries(['book', variables.bookId]);
                // Also invalidate word entries to refresh the chart if the goal changed
                queryClient.invalidateQueries(['bookWordEntries', variables.bookId]);
                toast({
                    title: "Book updated",
                    description: "Your book information has been successfully updated.",
                    variant: "default",
                });
            },
            onError: (error) => {
                console.error('Failed to update book:', error);
                toast({
                    title: "Error",
                    description: "Failed to update book information. Please try again.",
                    variant: "destructive",
                });
            },
        }
    );
};

export default useUpdateBook; 