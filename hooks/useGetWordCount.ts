import { useQuery } from 'react-query';
import axios from 'axios';

const fetchWordCountList = async (bookId: any) => {
    const response = await axios.get(`/api/books/wordCount/${bookId}`);
    return response.data.wordEntries;
};

const useGetWordCount = (bookId: any) => {
    return useQuery({
        queryKey: ['wordCountList', bookId],
        queryFn: () => fetchWordCountList(bookId),
    });
};

export default useGetWordCount;