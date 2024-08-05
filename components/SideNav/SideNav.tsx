'use client'
import { useEffect, useState } from 'react'
import Styles from './styles.module.css'
import CreatePage from '../CreatePageInput/CreatePageInput';
import { Reorder } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { Page } from '@/app/types/page';
import Row from './Row';

export default function SideNav() {
    const [isLoading, setIsLoading] = useState(false);
    const [newPageValue, setNewPageValue] = useState<String>('');
    const [list, setList] = useState<Page[]>([]);
    const [synonyms, setSynonyms] = useState([]);
    const router = useRouter();

    const [debouncedEditor] = useDebounce(list, 3000);

    useEffect(() => {
        if (debouncedEditor) {
            saveOrder();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedEditor]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }

                const apiData = await response.json();
                setList(apiData);
                setIsLoading(false);
            } catch (error: any) {
                console.error('Error fetching product:', error.message);
            }
        };

        fetchData();
    }, [newPageValue])

    const returnSynonyms = async () => {
        try {
            const response = await fetch(`https://api.api-ninjas.com/v1/thesaurus?word=test`, {
                method: 'GET',
                headers: {
                    'x-api-key': "38h9yEFWG07puaM0exfyPw==UiJLW3B39rzEM2XW",
                    'Content-Type': 'application/json'
                }
            });
            const res = await response.json();
            setSynonyms(res.synonyms);
        } catch (e) {
            console.error(e)
        }
    }


    const handleNavigation = (id: string) => {
        router.push(`/page/${id}`)
    };

    const onReorder = (test: Page[]) => {
        setList(test)
    }

    const saveOrder = async () => {
        console.log("SAVING ORDER")
        // Save array index to the order
        console.log(list)
        try {
            const response = await fetch('/api/pages/update-pages-order', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(list)
            });

            if (response.ok) {
                console.log(await response.text());
            } else {
                console.error('Failed to update page orders');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className={Styles.navigation}>
            <h1 className={Styles.header}>Navigation</h1>
            <Reorder.Group style={{ listStyle: 'none' }} axis='y' values={list} onReorder={onReorder}>
                {list.map((page: Page) => (
                    <Reorder.Item key={`${page.pages ? 'folder-' : 'page-'}-${page.id}`} value={page}>
                        <Row page={page} handleNavigation={handleNavigation} setNewPageValue={setNewPageValue} />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <CreatePage setNewPageValue={setNewPageValue} />
            <button onClick={returnSynonyms}>Look Up Thesaurus</button>
            <div style={{ display: "flex" }}>
                {synonyms.map((word) => (
                    <p style={{ marginLeft: '1em' }} key={word}>{word}</p>
                ))
                }
            </div>
        </div>
    )
}