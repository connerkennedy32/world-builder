'use client'
import { useEffect, useState } from 'react'
import Styles from './styles.module.css'
import { Reorder } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';

export default function Folder({ folder, list }: any) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [currentFolder, setCurrentFolder] = useState(folder);
    const router = useRouter();
    const [debouncedEditor] = useDebounce(currentFolder, 3000);

    useEffect(() => {
        if (debouncedEditor) {
            saveOrder();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedEditor]);


    const onReorder = (test: any) => {
        console.log("REORDER", test)
        console.log("list", list)

        setCurrentFolder(test);
    }
    const saveOrder = async () => {
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
    const handleNavigation = (id: string) => {
        router.push(`/page/${id}`)
    };
    return (
        <div >
            <span onClick={() => setIsExpanded(!isExpanded)}>{folder.name}</span>
            {isExpanded && <Reorder.Group style={{ listStyle: 'none' }} axis='y' values={folder.pages} onReorder={onReorder}>
                {currentFolder.pages.map((page: any) => (
                    <Reorder.Item key={page.id} value={page}>
                        <div className={Styles.rowElement} style={{ marginLeft: '1em' }} key={page.id} onClick={() => handleNavigation(page.id)}>
                            {page.title}
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>}
        </div>
    )
}