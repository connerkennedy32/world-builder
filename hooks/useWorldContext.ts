import { useQuery, useQueryClient } from 'react-query'
import axios from 'axios'

const fetchWorldContext = async () => {
    const res = await axios.get('/api/world-context')
    return res.data.item
}

const useWorldContext = () => {
    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: ['worldContext'],
        queryFn: fetchWorldContext,
    })

    const invalidate = () => queryClient.invalidateQueries('worldContext')

    return { ...query, invalidate }
}

export default useWorldContext
