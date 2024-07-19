'use client'
import { useEffect, useState } from 'react'
import Styles from './styles.module.css'
import Link from 'next/link';
import CreatePage from '../CreatePageInput/CreatePageInput';
import trash from '../../public/trash.svg'
import Image from 'next/image';
import ConfirmDeleteScreen from '../ConfirmDeleteScreen/ConfirmDeleteScreen';


export default function SideNav() {
    const [isLoading, setIsLoading] = useState(false);
    const [list, setList] = useState([]);

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
    }, [])

    const handleTrashClick = (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // Stop the event from bubbling up
        alert("HELLO")
        console.log("CLICKED TRASH");
    };

    return (
        <div className={Styles.navigation}>
            <h1 className={Styles.header}>Navigation</h1>
            {list.map((page: any) => (
                <Link className={Styles.rowElement} key={page.id} href={`/page/${page.id}`}>
                    <p className={Styles.pageTitle}>{page.title}</p>
                    <div onClick={handleTrashClick}>
                        <Image id='test' src={trash} alt='trash' width={20} height={20} />
                    </div>
                </Link>
            ))}
            <CreatePage />
            {/* <ConfirmDeleteScreen onConfirm={() => console.log('confirm')} onCancel={() => { console.log('cancel') }} /> */}
        </div>
    )
}