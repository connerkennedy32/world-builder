import { useState } from 'react';

const CreatePage = () => {
    const [query, setQuery] = useState('');

    const handleKeyPress = async (event: { key: string; }) => {
        if (event.key === 'Enter' && query !== '') {
            try {
                const response = await fetch('/api', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title: query })
                });
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
            onKeyPress={handleKeyPress}
            placeholder="Press Enter to submit"
        />
    );
};

export default CreatePage;