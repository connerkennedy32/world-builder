'use client'
import * as React from 'react';
import useGetBookById from '@/hooks/useGetBookById';
import useUpdateBook from '@/hooks/useUpdateBook';
import { useParams } from 'next/navigation';
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

export default function BookTrackerPage() {
    const { book_id: bookId } = useParams() as { book_id: string };
    const { data: bookDetails, isLoading: bookDetailsLoading, isError: bookDetailsError } = useGetBookById(bookId);
    const { data: wordEntries, isLoading: wordEntriesLoading, isError: wordEntriesError } = useGetBookWordEntries(bookId);
    const { mutate: updateBookMutation, isLoading: updateBookLoading } = useUpdateBook();
    const [showDots, setShowDots] = React.useState(false);

    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'goalWordCount' ? parseInt(value) || 0 : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
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

    return (
        <div className={Styles.centerSidebarOpen}>
            <div className="p-6 pb-2">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{bookDetails?.title}</h1>
                        <p className="text-sm text-muted-foreground">{bookDetails?.author}</p>
                    </div>
                    <div className="flex gap-2">
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

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Book Details</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
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
