'use client'
import { useEffect, useState } from 'react'
import CreatePage from '../CreatePageInput/CreatePageInput';
import { Reorder } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { Page } from '@/types/pageTypes';
import Row from './Row';
import useSavePageOrder from '@/hooks/useSavePageOrder';
import useGetPageList from '@/hooks/useGetPageList';
import { Button } from '@mui/material';

export default function SideNav() {
    const savePageOrder = useSavePageOrder();
    const [newPageValue, setNewPageValue] = useState<String>('');
    const { data: pages = [], isLoading } = useGetPageList();
    const [order, setOrder] = useState<Page[]>(pages);
    const router = useRouter();
    const [debouncedEditor] = useDebounce(order, 500);
    const pathName = usePathname();
    const currentId = pathName.split('/').pop();

    useEffect(() => {
        if (!isLoading) {
            setOrder(pages);
        }
    }, [pages, isLoading]);

    useEffect(() => {
        if (debouncedEditor) {
            savePageOrder.mutate(order || []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedEditor]);

    const handleNavigation = (id: string) => {
        router.push(`/page/${id}`)
    };

    return (
        <>
            <Reorder.Group style={{ listStyle: 'none' }} axis='y' values={order} onReorder={setOrder}>
                {order.map((page: Page) => (
                    <Row key={`${page.pages ? 'folder-' : 'page-'}-${page.id}`} page={page} currentId={currentId} handleNavigation={handleNavigation} setNewPageValue={setNewPageValue} />
                ))}
            </Reorder.Group>
            <CreatePage />
            <Button
                variant="contained"
                color="primary"
                style={{ margin: '1rem', width: '90%' }}
                onClick={() => router.push('/tracker')}
            >
                Tracker
            </Button>
        </>
    )
}