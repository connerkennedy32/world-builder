'use client'
import TipTap from "@/components/TipTap/TipTap";
import axios from "axios";
import { useQuery } from "react-query";

export default function Page({ params }: { params: { page_id: string } }) {
    const fetchPage = async () => {
        const response = await axios.get(`/api/pages/${params.page_id}`);
        return response;
    }

    const { data } = useQuery(
        {
            queryKey: ['page', params.page_id],
            queryFn: fetchPage,
        });

    if (!data?.data?.page?.content) return null;

    return (
        <>
            <TipTap page_content={data?.data.page.content} page_id={params.page_id} />
        </>
    )
}