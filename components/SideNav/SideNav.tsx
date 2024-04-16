'use client'
import { useEffect, useState } from 'react'
import Styles from './styles.module.css'
import Link from 'next/link';


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

    return (
        <div className={Styles.navigation}>
            <h1 className={Styles.header}>Navigation</h1>
            {list.map((page: any) => (
                <Link style={{ textDecoration: 'none', color: 'black' }} key={page.id} href={`/page/${page.id}`}>
                    <p className={Styles.rowElement}>{page.title}</p>
                </Link>
            ))}
        </div>
    )
}