import { useQuery } from 'react-query';
import axios from 'axios';

const fetchBookList = async (viewAll?: boolean) => {
    const response = await axios.get('/api/books', {
        params: {
            viewAll: viewAll
        }
    });
    return response.data;
};

const useGetBookList = (viewAll?: boolean) => {
    return useQuery({
        queryKey: ['bookList'],
        queryFn: () => fetchBookList(viewAll),
    });
};

export default useGetBookList;