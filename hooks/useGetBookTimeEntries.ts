import { useQuery } from 'react-query';
import axios from 'axios';

const fetchBookTimeEntries = async (bookId: string) => {
    const response = await axios.get(`/api/books/${bookId}/time-entries`);
    return response.data;
};

const useGetBookTimeEntries = (bookId: string) => {
    return useQuery({
        queryKey: ['bookTimeEntries', bookId],
        queryFn: () => fetchBookTimeEntries(bookId),
    });
};

export default useGetBookTimeEntries;
