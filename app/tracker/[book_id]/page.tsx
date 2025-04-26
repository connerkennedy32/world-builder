'use client'
import * as React from 'react';
import { useContext } from 'react';
import useGetBookById from '@/hooks/useGetBookById';
import useUpdateBook from '@/hooks/useUpdateBook';
import { useParams, useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import useGetBookWordEntries from '@/hooks/useGetBookWordEntries';
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { convertWordEntriesToChartData } from '@/app/utils/wordEntryUtils';
import Styles from './styles.module.css';
import FinishByCalculator from '@/components/FinishByCalculator/FinishByCalculator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import useGetBookList from '@/hooks/useGetBookList';
import { Book } from '@prisma/client';
import { toast } from '@/hooks/use-toast';
import useCreateNewTimeEntry from '@/hooks/useCreateNewTimeEntry';
import { GlobalContext } from '@/components/GlobalContextProvider';
import useCreateNewWordEntry from '@/hooks/useCreateNewWordEntry';
import { useQueryClient } from 'react-query';
export default function BookTrackerPage() {
    const { book_id: bookId } = useParams() as { book_id: string };
    const { data: bookDetails, isLoading: bookDetailsLoading, isError: bookDetailsError } = useGetBookById(bookId);
    const { data: wordEntries, isLoading: wordEntriesLoading, isError: wordEntriesError } = useGetBookWordEntries(bookId);
    const { mutate: createNewTimeEntry, isLoading: createNewTimeEntryLoading } = useCreateNewTimeEntry();
    const { mutate: createNewWordEntry, isLoading: createNewWordEntryLoading } = useCreateNewWordEntry();
    const { data: books, isLoading: booksLoading, isError: booksError } = useGetBookList(true);
    const { mutate: updateBookMutation, isLoading: updateBookLoading } = useUpdateBook();
    const { minutes, reset } = useContext(GlobalContext);
    const queryClient = useQueryClient();
    const router = useRouter();
    const [showDots, setShowDots] = React.useState(false);
    const [overriddenMinutes, setOverriddenMinutes] = React.useState<number | null>(null);
    const [wordCount, setWordCount] = React.useState<number>(0);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [isAddEntryDialogOpen, setIsAddEntryDialogOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({
        title: '',
        author: '',
        goalWordCount: 0
    });

    React.useEffect(() => {
        if (bookDetails) {
            setFormData({
                title: bookDetails.title || '',
                author: bookDetails.author || '',
                goalWordCount: bookDetails.goalWordCount || 0
            });
        }
    }, [bookDetails]);

    const isLoading = bookDetailsLoading || wordEntriesLoading;

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (bookDetailsError || wordEntriesError || !bookDetails || !wordEntries) {
        return <div>Error loading data or no data found.</div>;
    }

    const currentWordCount = wordEntries.length > 0 ? wordEntries[wordEntries.length - 1]?.wordCount || 0 : 0;
    const goalWordCount = bookDetails?.goalWordCount || 0;
    const progressPercentage = goalWordCount > 0 ? (currentWordCount / goalWordCount) * 100 : 0;

    const chartData = convertWordEntriesToChartData(wordEntries);
    const chartConfig = {
        wordCount: {
            label: "Word Count",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig

    const handleEditClick = () => {
        setIsEditDialogOpen(true);
    };

    const handleAddEntryClick = () => {
        setIsAddEntryDialogOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'goalWordCount' ? parseInt(value) || 0 : value,
        });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateBookMutation({
                bookId,
                title: formData.title,
                author: formData.author,
                goalWordCount: formData.goalWordCount
            });
            setIsEditDialogOpen(false);
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    const handleAddEntrySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            createNewTimeEntry({ bookId: parseInt(bookId), minutes: overriddenMinutes || minutes }, {
                onSuccess: () => {
                    toast({
                        title: `${overriddenMinutes || minutes} minute${(overriddenMinutes || minutes) === 1 ? '' : 's'} added to tracker`,
                        description: 'You can now see your time in the tracker',
                    });
                    reset();
                    setOverriddenMinutes(null);
                }
            });
        } catch (error) {
            console.error('Error adding entry:', error);
        }
    };

    const handleWordEntrySubmit = () => {
        createNewWordEntry(
            { bookId: parseInt(bookId), date: new Date().toISOString().split('T')[0], wordCount: wordCount || 0 },
            {
                onSuccess: () => {
                    toast({
                        title: `${wordCount} word${wordCount === 1 ? '' : 's'} added to tracker`,
                        description: 'You can now see your word count in the tracker',
                    });
                    queryClient.invalidateQueries({ queryKey: ['bookWordEntries', bookId] });
                    setWordCount(0);
                }
            }
        );
    };

    return (
        <div className={Styles.centerSidebarOpen}>
            <div className="p-6 pb-2">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="px-3 py-2 hover:bg-accent/50 transition-colors group"
                                >
                                    <span className="text-2xl font-semibold tracking-tight mr-1 group-hover:text-primary">
                                        {bookDetails?.title}
                                    </span>
                                    <ChevronDown size={16} className="text-muted-foreground group-hover:text-primary" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-[200px]">
                                {books?.map((book: Book) => (
                                    <DropdownMenuItem
                                        key={book.id}
                                        onClick={() => router.push(`/tracker/${book.id}`)}
                                        className="cursor-pointer"
                                    >
                                        <p className={`text-sm ${book.id === parseInt(bookId) ? 'font-medium text-primary' : 'text-muted-foreground'}`}>
                                            {book.title}
                                        </p>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <p className="text-sm text-muted-foreground pl-3">
                            {bookDetails?.author ? `by ${bookDetails.author}` : 'No author specified'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleAddEntryClick}>
                            Add Entry
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleEditClick}>
                            Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowDots(!showDots)}>
                            {showDots ? 'Hide Dots' : 'Show Dots'}
                        </Button>
                    </div>
                </div>
                <div className="pt-2">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>Current: {currentWordCount.toLocaleString()} words</span>
                        <span>Goal: {goalWordCount.toLocaleString()} words</span>
                    </div>
                    <Progress value={progressPercentage} aria-label={`${progressPercentage.toFixed(0)}% towards goal`} />
                </div>
            </div>
            <div className="p-6 pt-0">
                <ChartContainer config={chartConfig} className="min-h-[300px] max-h-[400px] w-full">
                    <AreaChart
                        data={chartData}
                        margin={{
                            top: 50,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            domain={[0, goalWordCount > 0 ? goalWordCount : 'dataMax']}
                            dataKey="wordCount"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => value.toLocaleString()}
                        />
                        <Tooltip
                            cursor={false}
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                borderColor: 'hsl(var(--border))',
                                borderRadius: 'var(--radius)',
                            }}
                            labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            formatter={(value: number, name: string) => {
                                return [`${value.toLocaleString()} words`, chartConfig.wordCount.label];
                            }}
                        />
                        <Area
                            dataKey="wordCount"
                            type="monotone"
                            fill="var(--color-wordCount)"
                            fillOpacity={0.7}
                            stroke="var(--color-wordCount)"
                            stackId="a"
                            connectNulls
                            dot={showDots}
                        />
                    </AreaChart>
                </ChartContainer>
            </div>

            <FinishByCalculator currentWordCount={currentWordCount} goalWordCount={goalWordCount} />

            <Dialog open={isAddEntryDialogOpen} onOpenChange={setIsAddEntryDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Book Entry</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-6">
                        <div>
                            <div className="flex flex-row gap-2 items-center">
                                <Label htmlFor="date" className="text-right">Time Entry</Label>
                                <Input
                                    id="timeEntry"
                                    name="timeEntry"
                                    type="number"
                                    value={overriddenMinutes || minutes}
                                    onChange={(e) => setOverriddenMinutes(parseInt(e.target.value))}
                                    className="w-24"
                                />
                                <Button disabled={createNewTimeEntryLoading || (minutes === 0 && (overriddenMinutes === null || overriddenMinutes === 0))} variant="default" onClick={handleAddEntrySubmit}>
                                    Add {overriddenMinutes || minutes} minute{(overriddenMinutes || minutes) === 1 ? '' : 's'}
                                </Button>
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-row gap-2 items-center">
                                <Label htmlFor="date" className="text-right">Word Entry</Label>
                                <Input
                                    id="wordEntry"
                                    name="wordEntry"
                                    type="number"
                                    value={wordCount}
                                    onChange={(e) => setWordCount(parseInt(e.target.value))}
                                    className="w-24"
                                />
                                <Button disabled={!wordCount} variant="default" onClick={handleWordEntrySubmit}>
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Book Details</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="author" className="text-right">Author</Label>
                                <Input
                                    id="author"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="goalWordCount" className="text-right">Goal Word Count</Label>
                                <Input
                                    id="goalWordCount"
                                    name="goalWordCount"
                                    type="number"
                                    value={formData.goalWordCount}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={updateBookLoading}>
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
