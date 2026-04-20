'use client'
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function FinishByCalculator({ currentWordCount, goalWordCount }: { currentWordCount: number, goalWordCount: number }) {
    const [dailyWordCount, setDailyWordCount] = useState<number>(300);
    const [finishDate, setFinishDate] = useState<Date | null>(null);
    const [daysToFinish, setDaysToFinish] = useState<number>(0);

    useEffect(() => {
        if (dailyWordCount <= 0) return;
        const wordsRemaining = goalWordCount - currentWordCount;
        const days = Math.ceil(wordsRemaining / dailyWordCount);
        setDaysToFinish(days);
        const date = new Date();
        date.setDate(date.getDate() + days);
        setFinishDate(date);
    }, [currentWordCount, goalWordCount, dailyWordCount]);

    const getTimeDescription = (): string => {
        if (daysToFinish <= 0) return 'Complete';
        const months = Math.floor(daysToFinish / 30);
        const weeks = Math.floor(daysToFinish / 7);
        const remainingDays = daysToFinish % 7;
        if (months > 0) {
            const remainingWeeks = Math.floor((daysToFinish % 30) / 7);
            return `${months} month${months > 1 ? 's' : ''}${remainingWeeks > 0 ? ` and ${remainingWeeks} week${remainingWeeks > 1 ? 's' : ''}` : ''}`;
        } else if (weeks > 0) {
            return `${weeks} week${weeks > 1 ? 's' : ''}${remainingDays > 0 ? ` and ${remainingDays} day${remainingDays > 1 ? 's' : ''}` : ''}`;
        }
        return `${daysToFinish} day${daysToFinish > 1 ? 's' : ''}`;
    };

    const wordsRemaining = Math.max(0, goalWordCount - currentWordCount);
    const isComplete = currentWordCount >= goalWordCount && goalWordCount > 0;

    return (
        <div className="flex flex-col gap-4 h-full">
            <p className="text-sm font-medium">Projection</p>

            <div className="flex items-center gap-3">
                <Label htmlFor="dailyGoal" className="text-sm text-muted-foreground whitespace-nowrap">Words / day</Label>
                <Input
                    id="dailyGoal"
                    type="number"
                    value={dailyWordCount}
                    onChange={(e) => setDailyWordCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-24"
                    min="0"
                />
            </div>

            {isComplete ? (
                <p className="text-sm font-medium text-green-600">Goal reached. Congratulations!</p>
            ) : goalWordCount > 0 ? (
                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                        <span>Remaining</span>
                        <span className="font-medium text-foreground">{wordsRemaining.toLocaleString()} words</span>
                    </div>
                    {daysToFinish > 0 && (
                        <>
                            <div className="flex justify-between text-muted-foreground">
                                <span>At {dailyWordCount}/day, finish in</span>
                                <span className="font-medium text-foreground">{getTimeDescription()}</span>
                            </div>
                            {finishDate && (
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Estimated date</span>
                                    <span className="font-medium text-foreground">
                                        {finishDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">Set a word goal to see your projection.</p>
            )}
        </div>
    );
}
