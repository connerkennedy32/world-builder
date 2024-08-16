import { useQuery } from 'react-query';
import axios from 'axios';

const fetchWordCountList = async (bookId: any) => {
    const response = await axios.get(`/api/books/wordCount/${bookId}`);
    return response.data;
};

const useGetWordCountList = (bookId: any) => {
    return useQuery({
        queryKey: ['wordCountList'],
        queryFn: () => fetchWordCountList(bookId),
    });
};

export default useGetWordCountList;