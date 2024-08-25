import { useQuery } from 'react-query';
import axios from 'axios';

const fetchPageInfo = async (title: string) => {
    const response = await axios.get('/api/pages', {
        params: {
            title: title
        }
    });
    return response.data;
};

const useGetPageInfo = (title: string) => {
    return useQuery({
        queryKey: ['pageInfo', title],
        queryFn: () => fetchPageInfo(title),
        enabled: !!title,
    });
};

export default useGetPageInfo;