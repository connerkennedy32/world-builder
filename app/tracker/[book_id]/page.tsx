'use client'
import * as React from 'react';
import { useContext, useMemo } from 'react';
import useGetBookById from '@/hooks/useGetBookById';
import useUpdateBook from '@/hooks/useUpdateBook';
import { useParams, useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import useGetBookWordEntries from '@/hooks/useGetBookWordEntries';
import useGetBookTimeEntries from '@/hooks/useGetBookTimeEntries';
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { convertWordEntriesToChartData } from '@/app/utils/wordEntryUtils';
import FinishByCalculator from '@/components/FinishByCalculator/FinishByCalculator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Clock, BookOpen, Target, TrendingUp } from 'lucide-react';
import useGetBookList from '@/hooks/useGetBookList';
import { Book } from '@prisma/client';
import { toast } from '@/hooks/use-toast';
import useCreateNewTimeEntry from '@/hooks/useCreateNewTimeEntry';
import { StopwatchContext } from '@/components/StopwatchContextProvider';
import useCreateNewWordEntry from '@/hooks/useCreateNewWordEntry';
import { useQueryClient } from 'react-query';

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub?: string }) {
    return (
        <div className="flex-1 rounded-lg border bg-card p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Icon size={14} />
                <span className="text-xs font-medium">{label}</span>
            </div>
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
    );
}

export default function BookTrackerPage() {
    const { book_id: bookId } = useParams() as { book_id: string };
    const { data: bookDetails, isLoading: bookDetailsLoading, isError: bookDetailsError } = useGetBookById(bookId);
    const { data: wordEntries = [], isLoading: wordEntriesLoading, isError: wordEntriesError } = useGetBookWordEntries(bookId);
    const { data: timeEntries = [] } = useGetBookTimeEntries(bookId);
    const { mutate: createNewTimeEntry, isLoading: createNewTimeEntryLoading } = useCreateNewTimeEntry();
    const { mutate: createNewWordEntry } = useCreateNewWordEntry();
    const { data: books } = useGetBookList(true);
    const { mutate: updateBookMutation, isLoading: updateBookLoading } = useUpdateBook();
    const { minutes, reset } = useContext(StopwatchContext);
    const queryClient = useQueryClient();
    const router = useRouter();
    const [showDots, setShowDots] = React.useState(false);
    const [overriddenMinutes, setOverriddenMinutes] = React.useState<number | null>(null);
    const [wordCount, setWordCount] = React.useState<number>(0);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [isAddEntryDialogOpen, setIsAddEntryDialogOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({ title: '', author: '', goalWordCount: 0 });

    React.useEffect(() => {
        if (bookDetails) {
            setFormData({
                title: bookDetails.title || '',
                author: bookDetails.author || '',
                goalWordCount: bookDetails.goalWordCount || 0,
            });
        }
    }, [bookDetails]);

    const currentWordCount = wordEntries.length > 0 ? wordEntries[wordEntries.length - 1]?.wordCount || 0 : 0;
    const goalWordCount = bookDetails?.goalWordCount || 0;
    const progressPercentage = goalWordCount > 0 ? Math.min((currentWordCount / goalWordCount) * 100, 100) : 0;
    const totalMinutes = timeEntries.reduce((acc: number, e: any) => acc + e.minutes, 0);

    const formatTime = (mins: number) => {
        if (mins === 0) return '—';
        if (mins < 60) return `${mins}m`;
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    };

    const chartData = convertWordEntriesToChartData(wordEntries);
    const chartConfig = {
        wordCount: { label: 'Word Count', color: 'hsl(var(--chart-1))' },
    } satisfies ChartConfig;

    const sessionChartData = useMemo(() => {
        return [...timeEntries]
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((e: any) => ({ id: e.id, date: e.date, minutes: e.minutes }));
    }, [timeEntries]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'goalWordCount' ? parseInt(value) || 0 : value });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateBookMutation({ bookId, ...formData });
            setIsEditDialogOpen(false);
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    const handleAddEntrySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const mins = overriddenMinutes ?? minutes;
        createNewTimeEntry({ bookId: parseInt(bookId), minutes: mins }, {
            onSuccess: () => {
                toast({ title: `${mins} minute${mins === 1 ? '' : 's'} logged` });
                queryClient.invalidateQueries({ queryKey: ['bookTimeEntries', bookId] });
                reset();
                setOverriddenMinutes(null);
            }
        });
    };

    const handleWordEntrySubmit = () => {
        createNewWordEntry(
            { bookId: parseInt(bookId), date: new Date().toISOString().split('T')[0], wordCount: wordCount || 0 },
            {
                onSuccess: () => {
                    toast({ title: `${wordCount.toLocaleString()} words logged` });
                    queryClient.invalidateQueries({ queryKey: ['bookWordEntries', bookId] });
                    setWordCount(0);
                }
            }
        );
    };

    if (bookDetailsLoading || wordEntriesLoading) return <LoadingSpinner />;
    if (bookDetailsError || wordEntriesError || !bookDetails || !wordEntries) {
        return <div className="p-8 text-muted-foreground">Error loading data</div>;
    }

    return (
        <div className="flex flex-col gap-6 p-6">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-0.5">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="px-2 h-auto py-1 -ml-2 group">
                                <span className="text-2xl font-semibold tracking-tight">{bookDetails?.title}</span>
                                <ChevronDown size={16} className="text-muted-foreground ml-1" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {books?.map((book: Book) => (
                                <DropdownMenuItem
                                    key={book.id}
                                    onClick={() => router.push(`/tracker/${book.id}`)}
                                    className="cursor-pointer"
                                >
                                    <span className={book.id === parseInt(bookId) ? 'font-medium' : 'text-muted-foreground'}>
                                        {book.title}
                                    </span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {bookDetails?.author && (
                        <p className="text-sm text-muted-foreground pl-2">by {bookDetails.author}</p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsAddEntryDialogOpen(true)}>
                        Log entry
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                        Edit
                    </Button>
                </div>
            </div>

            {/* Progress */}
            <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{currentWordCount.toLocaleString()} words</span>
                    <span>Goal: {goalWordCount > 0 ? goalWordCount.toLocaleString() : 'not set'}</span>
                </div>
                <Progress value={progressPercentage} />
                <p className="text-xs text-muted-foreground">{progressPercentage.toFixed(1)}% complete</p>
            </div>

            {/* Stat cards */}
            <div className="flex gap-3">
                <StatCard icon={BookOpen} label="Words written" value={currentWordCount.toLocaleString()} />
                <StatCard
                    icon={Target}
                    label="Word goal"
                    value={goalWordCount > 0 ? goalWordCount.toLocaleString() : '—'}
                    sub={goalWordCount > 0 ? `${(goalWordCount - currentWordCount).toLocaleString()} remaining` : undefined}
                />
                <StatCard
                    icon={TrendingUp}
                    label="Progress"
                    value={goalWordCount > 0 ? `${progressPercentage.toFixed(0)}%` : '—'}
                />
                <StatCard
                    icon={Clock}
                    label="Time logged"
                    value={formatTime(totalMinutes)}
                    sub={timeEntries.length > 0 ? `${timeEntries.length} session${timeEntries.length !== 1 ? 's' : ''}` : 'No sessions yet'}
                />
            </div>

            {/* Word count chart */}
            <div className="rounded-lg border bg-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium">Word Count Progress</p>
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setShowDots(!showDots)}>
                        {showDots ? 'Hide' : 'Show'} dots
                    </Button>
                </div>
                {chartData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-[240px] w-full">
                        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 11 }}
                            />
                            <YAxis
                                domain={[0, goalWordCount > 0 ? goalWordCount : 'dataMax']}
                                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                                tickLine={false}
                                axisLine={false}
                                width={36}
                                tick={{ fontSize: 11 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: 'var(--radius)',
                                }}
                                labelFormatter={(l) => new Date(l).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                formatter={(v: number) => [v != null ? `${v.toLocaleString()} words` : '—', '']}
                                cursor={false}
                            />
                            <Area
                                dataKey="wordCount"
                                type="monotone"
                                stroke="var(--color-wordCount)"
                                strokeWidth={2}
                                fill="var(--color-wordCount)"
                                fillOpacity={0.15}
                                connectNulls
                                dot={showDots ? { r: 3, strokeWidth: 0 } : false}
                                activeDot={{ r: 4, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ChartContainer>
                ) : (
                    <div className="h-[240px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No word entries yet.</p>
                    </div>
                )}
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-2 gap-3">
                {/* Writing sessions */}
                <div className="rounded-lg border bg-card p-5">
                    <p className="text-sm font-medium mb-4">Writing Sessions</p>
                    {sessionChartData.length > 0 ? (
                        <ChartContainer config={{ minutes: { label: 'Minutes', color: 'hsl(var(--chart-2))' } }} className="h-[200px] w-full">
                            <BarChart data={sessionChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 11 }}
                                />
                                <YAxis
                                    tickFormatter={(v) => `${v}m`}
                                    tickLine={false}
                                    axisLine={false}
                                    width={36}
                                    tick={{ fontSize: 11 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: 'var(--radius)',
                                    }}
                                    labelFormatter={(l) => new Date(l).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    formatter={(v: number) => [`${v} min`, 'Session']}
                                    cursor={{ fill: 'hsl(var(--muted))' }}
                                />
                                <Bar dataKey="minutes" fill="var(--color-minutes)" radius={[3, 3, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ChartContainer>
                    ) : (
                        <div className="h-[200px] flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">No sessions logged yet.</p>
                        </div>
                    )}
                </div>

                {/* Projection */}
                <div className="rounded-lg border bg-card p-5">
                    <FinishByCalculator currentWordCount={currentWordCount} goalWordCount={goalWordCount} />
                </div>
            </div>

            {/* Log entry dialog */}
            <Dialog open={isAddEntryDialogOpen} onOpenChange={setIsAddEntryDialogOpen}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Log Entry</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-6 pt-2">
                        <div>
                            <Label className="text-sm font-medium mb-3 block">Time Session</Label>
                            <div className="flex items-center gap-3">
                                <Input
                                    type="number"
                                    value={overriddenMinutes ?? minutes}
                                    onChange={(e) => setOverriddenMinutes(parseInt(e.target.value))}
                                    className="w-24"
                                />
                                <span className="text-sm text-muted-foreground">minutes</span>
                                <Button
                                    disabled={createNewTimeEntryLoading || (minutes === 0 && (overriddenMinutes === null || overriddenMinutes === 0))}
                                    onClick={handleAddEntrySubmit}
                                    size="sm"
                                    className="ml-auto"
                                >
                                    Log time
                                </Button>
                            </div>
                        </div>
                        <div className="border-t pt-6">
                            <Label className="text-sm font-medium mb-3 block">Word Count</Label>
                            <div className="flex items-center gap-3">
                                <Input
                                    type="number"
                                    value={wordCount || ''}
                                    onChange={(e) => setWordCount(parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                    className="w-32"
                                />
                                <span className="text-sm text-muted-foreground">words</span>
                                <Button
                                    disabled={!wordCount}
                                    onClick={handleWordEntrySubmit}
                                    size="sm"
                                    className="ml-auto"
                                >
                                    Log words
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit book dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Edit Book</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="author" className="text-right">Author</Label>
                                <Input id="author" name="author" value={formData.author} onChange={handleInputChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="goalWordCount" className="text-right">Word Goal</Label>
                                <Input id="goalWordCount" name="goalWordCount" type="number" value={formData.goalWordCount} onChange={handleInputChange} className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={updateBookLoading}>Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
