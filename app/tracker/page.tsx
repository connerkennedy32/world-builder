'use client'
import { useEffect } from 'react';
import { Book } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useGetCurrentUserId } from '@/hooks/useGetCurrentUserId';
import useGetBookList from '@/hooks/useGetBookList';

export default function TrackerPage() {
    const { data: books } = useGetBookList(true);
    const router = useRouter();
    const userId = useGetCurrentUserId();

    useEffect(() => {
        if (books && books.length > 0) {
            const userBook = books.find((book: Book) => book.userId === userId);
            if (userBook) {
                router.push(`/tracker/${userBook.id}`);
            }
        }
    }, [books, router, userId]);

    return;

    // const handleAddBook = () => {
    //     setIsOpen(true);
    // };

    // const handleSubmit = () => {
    //     createBook({
    //         title,
    //         goalWordCount: goalWordCount ? parseInt(goalWordCount) : undefined,
    //         author: author || undefined
    //     }, {
    //         onSuccess: () => {
    //             setIsOpen(false);
    //             setTitle('');
    //             setGoalWordCount('');
    //             setAuthor('');
    //         }
    //     });
    // };

    // if (isLoading) {
    //     return <LoadingSpinner />;
    // }

    // if (isError) {
    //     return <div>Error loading books</div>;
    // }

    // return (
    //     <div style={{ display: 'flex', flexDirection: 'column', marginTop: '4rem' }}  >
    //         {books?.map((book: Book) => (
    //             <BookCard key={book.id} book={book} />
    //         ))}

    //         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
    //             <Button
    //                 onClick={handleAddBook}
    //                 className="rounded-full w-10 h-10 p-0 text-xl font-bold"
    //                 title="Add Book"
    //             >
    //                 +
    //             </Button>
    //         </div>

    //         <Dialog open={isOpen} onOpenChange={setIsOpen}>
    //             <DialogContent>
    //                 <DialogHeader>
    //                     <DialogTitle>Add New Book</DialogTitle>
    //                 </DialogHeader>
    //                 <div className="grid gap-4 py-4">
    //                     <div className="grid grid-cols-4 items-center gap-4">
    //                         <Label htmlFor="title" className="text-right">Title</Label>
    //                         <Input
    //                             id="title"
    //                             value={title}
    //                             onChange={(e) => setTitle(e.target.value)}
    //                             className="col-span-3"
    //                         />
    //                     </div>
    //                     <div className="grid grid-cols-4 items-center gap-4">
    //                         <Label htmlFor="goal" className="text-right">Word Count Goal</Label>
    //                         <Input
    //                             id="goal"
    //                             type="number"
    //                             value={goalWordCount}
    //                             onChange={(e) => setGoalWordCount(e.target.value)}
    //                             className="col-span-3"
    //                         />
    //                     </div>
    //                     <div className="grid grid-cols-4 items-center gap-4">
    //                         <Label htmlFor="author" className="text-right">Author</Label>
    //                         <Input
    //                             id="author"
    //                             value={author}
    //                             onChange={(e) => setAuthor(e.target.value)}
    //                             className="col-span-3"
    //                         />
    //                     </div>
    //                 </div>
    //                 <DialogFooter>
    //                     <Button onClick={handleSubmit} disabled={!title || isCreating}>
    //                         {isCreating ? 'Adding...' : 'Add Book'}
    //                     </Button>
    //                 </DialogFooter>
    //             </DialogContent>
    //         </Dialog>
    //     </div>
    // )
}
