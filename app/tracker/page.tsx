'use client'
import BookCard from '@/components/BookCard/BookCard';

export default function TrackerPage() {

    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '4rem' }}  >
            <BookCard bookId={1} />
        </div>
    )
}
