import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

interface TimeEntryData {
    minutes: number;
    bookId: number;
}

const useCreateNewTimeEntry = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (data: TimeEntryData) => {
            const response = await axios.post('/api/books/timeEntry', data);
            return response.data;
        },
        {
            onSuccess: () => {
                // Invalidate and refetch the timeEntries query
                queryClient.invalidateQueries('timeEntries');
            },
            onError: (error) => {
                console.error('Error creating new time entry:', error);
            },
        }
    );
};

export default useCreateNewTimeEntry;
