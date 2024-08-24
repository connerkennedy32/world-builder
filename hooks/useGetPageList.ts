import { useQuery } from 'react-query';
import axios from 'axios';

const fetchPageList = async () => {
    const response = await axios.get('/api');
    return response.data;
};

const useGetPageList = () => {
    return useQuery({
        queryKey: ['pageList'],
        queryFn: fetchPageList,
    });
};

export default useGetPageList;