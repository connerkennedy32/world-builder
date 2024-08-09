'use client'
import { useEffect, useState } from 'react'
import CreatePage from '../CreatePageInput/CreatePageInput';
import { Reorder } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { Page } from '@/types/pageTypes';
import Row from './Row';
import ContextMenu from './ContextMenu';

export default function SideNav() {
    const [isLoading, setIsLoading] = useState(false);
    const [newPageValue, setNewPageValue] = useState<String>('');
    const [list, setList] = useState<Page[]>([]);
    const router = useRouter();

    const [debouncedEditor] = useDebounce(list, 1000);
    const pathName = usePathname();
    const currentId = pathName.split('/').pop();

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

    const handleNavigation = (id: string) => {
        router.push(`/page/${id}`)
    };

    const onReorder = (test: Page[]) => {
        setList(test)
    }

    const saveOrder = async () => {
        console.log("SAVING ORDER")
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
        <>
            <Reorder.Group style={{ listStyle: 'none' }} axis='y' values={list} onReorder={onReorder}>
                {list.map((page: Page) => (
                    <Reorder.Item key={`${page.pages ? 'folder-' : 'page-'}-${page.id}`} value={page}>
                        <Row page={page} currentId={currentId} handleNavigation={handleNavigation} setNewPageValue={setNewPageValue} />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <ContextMenu />
            <CreatePage setNewPageValue={setNewPageValue} />
        </>
    )
}