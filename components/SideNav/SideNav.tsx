'use client'
import { useEffect, useState } from 'react'
import CreatePage from '../CreatePageInput/CreatePageInput';
import CreateFolder from '../CreateFolder/CreateFolder';
import { Reorder } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { Page } from '@/types/pageTypes';
import Row from './Row';
import useGetItemList from '@/hooks/useGetItemList';
import { Button } from '@mui/material';

export default function SideNav() {
    const [isFolderIconVisible, setIsFolderIconVisible] = useState(true);
    const [isPageIconVisible, setIsPageIconVisible] = useState(true);
    const { data: pages = [], isSuccess } = useGetItemList();
    const [order, setOrder] = useState<Page[]>(pages);
    const router = useRouter();
    const pathName = usePathname();
    const currentId = pathName.split('/').pop();

    useEffect(() => {
        if (isSuccess) {
            setOrder(pages);
        }
    }, [pages, isSuccess]);

    const handleNavigation = (id: string) => {
        router.push(`/page/${id}`)
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem' }}>
                <CreatePage visible={isPageIconVisible} setIsFolderIconVisible={setIsFolderIconVisible} isFolderIconVisible={isFolderIconVisible} />
                <CreateFolder visible={isFolderIconVisible} setIsPageIconVisible={setIsPageIconVisible} isPageIconVisible={isPageIconVisible} />
            </div>
            <Reorder.Group style={{ listStyle: 'none' }} axis='y' values={order} onReorder={setOrder}>
                {order.map((page: Page) => (
                    <Row key={`${page.pages ? 'folder-' : 'page-'}-${page.id}`} page={page} currentId={currentId} handleNavigation={handleNavigation} />
                ))}
            </Reorder.Group>
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