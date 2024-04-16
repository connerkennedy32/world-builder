'use client'

import TipTap from "@/components/TipTap/TipTap";
import { useEffect, useState } from "react"

interface page {
    id: number;
    content: string;
    title: string;
}

export default function Page({ params }: { params: { page_id: string } }) {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successfulSubmit, setSuccessfulSubmit] = useState(false);
    const [page, setPage] = useState<page>({
        "id": 0, "content": "", "title": "Loading..."
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsPageLoading(true);
                const response = await fetch(`/api/${params.page_id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch page');
                }

                const data = await response.json();
                setPage(data.page);
                setIsPageLoading(false);
            } catch (error: any) {
                console.error('Error fetching page:', error.message);
            }
        };

        fetchData();
    }, [params.page_id]);

    return (
        <>
            <h1>{page.title}</h1>
            <TipTap page_content={page.content} page_id={params.page_id} />
        </>
    )
}