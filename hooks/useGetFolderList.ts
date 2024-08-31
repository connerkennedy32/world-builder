import { useQuery } from 'react-query';
import axios from 'axios';

const fetchFolderList = async () => {
    const response = await axios.get('/api/folders');
    return response.data;
};

const useGetFolderList = () => {
    return useQuery({
        queryKey: ['folderList'],
        queryFn: fetchFolderList,
    });
};

export default useGetFolderList;