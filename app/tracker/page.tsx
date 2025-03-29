'use client'
import BookCard from '@/components/BookCard/BookCard';
import useGetBookList from '@/hooks/useGetBookList';
import useCreateBook from '@/hooks/useCreateBook';
import { Book } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

export default function TrackerPage() {
    const { data, isLoading, isError } = useGetBookList(true);
    const { mutate: createBook, isLoading: isCreating } = useCreateBook();
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [goalWordCount, setGoalWordCount] = useState('');
    const [author, setAuthor] = useState('');

    const handleAddBook = () => {
        setIsOpen(true);
    };

    const handleSubmit = () => {
        createBook({
            title,
            goalWordCount: goalWordCount ? parseInt(goalWordCount) : undefined,
            author: author || undefined
        }, {
            onSuccess: () => {
                setIsOpen(false);
                setTitle('');
                setGoalWordCount('');
                setAuthor('');
            }
        });
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return <div>Error loading books</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '4rem' }}  >
            {data?.map((book: Book) => (
                <BookCard key={book.id} book={book} />
            ))}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <Button
                    onClick={handleAddBook}
                    className="rounded-full w-10 h-10 p-0 text-xl font-bold"
                    title="Add Book"
                >
                    +
                </Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Book</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="goal" className="text-right">Word Count Goal</Label>
                            <Input
                                id="goal"
                                type="number"
                                value={goalWordCount}
                                onChange={(e) => setGoalWordCount(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="author" className="text-right">Author</Label>
                            <Input
                                id="author"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSubmit} disabled={!title || isCreating}>
                            {isCreating ? 'Adding...' : 'Add Book'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
