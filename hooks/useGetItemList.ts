import { useQuery } from 'react-query';
import axios from 'axios';

const fetchItemList = async () => {
    const response = await axios.get('/api');
    return response.data;
};

const useGetItemList = () => {
    return useQuery({
        queryKey: ['pageList'],
        queryFn: fetchItemList,
    });
};

export default useGetItemList;