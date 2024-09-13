'use client'
import BookCard from '@/components/BookCard/BookCard';
import useGetBookList from '@/hooks/useGetBookList';
import { Book } from '@prisma/client';

export default function TrackerPage() {
    const { data, isLoading, isError } = useGetBookList(true)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '4rem' }}  >
            {data?.map((book: Book) => (
                <BookCard key={book.id} book={book} />
            ))}
        </div>
    )
}
