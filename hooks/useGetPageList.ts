import { useQuery } from 'react-query';
import axios from 'axios';

const fetchPageList = async () => {
    const response = await axios.get('/api');
    return response.data;
};

const useGetPageList = (newPageValue: String) => {
    return useQuery({
        queryKey: ['pageList', newPageValue],
        queryFn: fetchPageList,
    });
};

export default useGetPageList;