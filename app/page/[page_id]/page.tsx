'use client'
import TipTap from "@/components/TipTap/TipTap";
import axios from "axios";
import { useQuery } from "react-query";
import { motion } from "framer-motion";

export default function Page({ params }: { params: { page_id: string } }) {
    const fetchPage = async () => {
        const response = await axios.get(`/api/pages/${params.page_id}`);
        return response.data;
    }

    const { data, isLoading } = useQuery(
        {
            queryKey: ['page', params.page_id],
            queryFn: fetchPage,
        });

    if (!data?.page?.content) return null;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: !isLoading ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ marginTop: '1.5em' }}
            >
                <TipTap page_content={data.page.content} page_id={params.page_id} />
            </motion.div>
        </>
    )
}