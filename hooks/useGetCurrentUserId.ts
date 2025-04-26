import { useUser } from '@clerk/nextjs';
import { useQuery } from 'react-query';

const getCurrentUserId = async (clerkId: string) => {
    const response = await fetch(`/api/users?clerkId=${clerkId}`);
    return response.json();
};

export const useGetCurrentUserId = () => {
    const { user } = useUser();
    const { data, isLoading, isError } = useQuery({
        queryKey: ['user', user?.id],
        queryFn: () => getCurrentUserId(user?.id || ''),
    })

    return data?.userId;
};

