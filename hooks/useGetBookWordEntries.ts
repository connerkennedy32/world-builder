import { useQuery } from 'react-query';
import axios from 'axios';

const fetchBookWordEntries = async (bookId: string) => {
    const response = await axios.get(`/api/books/${bookId}/word-entries`);
    return response.data;
};

const useGetBookWordEntries = (bookId: string) => {
    return useQuery({
        queryKey: ['bookWordEntries', bookId],
        queryFn: () => fetchBookWordEntries(bookId),
    });
};

export default useGetBookWordEntries;