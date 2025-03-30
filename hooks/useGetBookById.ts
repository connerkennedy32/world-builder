import { useQuery } from 'react-query';
import axios from 'axios';

const fetchBookById = async (bookId: string) => {
    const response = await axios.get(`/api/books/${bookId}`);
    return response.data;
};

const useGetBookById = (bookId: string) => {
    return useQuery({
        queryKey: ['book', bookId],
        queryFn: () => fetchBookById(bookId),
    });
};

export default useGetBookById;