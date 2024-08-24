import { useState } from 'react';
import useCreatePage from '@/hooks/useCreatePage';

const CreatePage = () => {
    const [query, setQuery] = useState('');
    const { mutate: createPage, isLoading: isCreatingPage, error: createPageError } = useCreatePage();
    const handleKeyDown = async (event: { key: string; }) => {
        if (event.key === 'Enter' && query !== '') {
            try {
                createPage(query);
            } catch (error) {
                // Handle error
                console.error(error);
            }
        }
    };

    return (
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Press Enter to submit"
        />
    );
};

export default CreatePage;