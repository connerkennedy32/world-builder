'use client'
import * as React from 'react';
import useGetBookById from '@/hooks/useGetBookById';
import { useParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import useGetBookWordEntries from '@/hooks/useGetBookWordEntries';
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { convertWordEntriesToChartData } from '@/app/utils/wordEntryUtils';

export default function BookTrackerPage() {
    const { book_id: bookId } = useParams() as { book_id: string };
    const { data: bookDetails, isLoading: bookDetailsLoading, isError: bookDetailsError } = useGetBookById(bookId);
    const { data: wordEntries, isLoading: wordEntriesLoading, isError: wordEntriesError } = useGetBookWordEntries(bookId);

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
    console.log('chartData', chartData);
    const chartConfig = {
        wordCount: {
            label: "Word Count",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig

    return (
        <div className="p-4 md:p-8">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>{bookDetails?.title}</CardTitle>
                    <CardDescription>{bookDetails?.author}</CardDescription>
                    <div className="pt-2">
                        <div className="flex justify-between text-sm text-muted-foreground mb-1">
                            <span>Current: {currentWordCount.toLocaleString()} words</span>
                            <span>Goal: {goalWordCount.toLocaleString()} words</span>
                        </div>
                        <Progress value={progressPercentage} aria-label={`${progressPercentage.toFixed(0)}% towards goal`} />
                    </div>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                        <AreaChart
                            width={500}
                            height={300}
                            data={chartData}
                            margin={{
                                top: 10,
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
                                dot={true}
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
