import { useState, useEffect } from 'react';

export default function FinishByCalculator({ currentWordCount, goalWordCount }: { currentWordCount: number, goalWordCount: number }) {
    const [dailyWordCount, setDailyWordCount] = useState<number>(500);
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

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTimeDescription = (): string => {
        if (daysToFinish <= 0) return "Completed!";

        const weeks = Math.floor(daysToFinish / 7);
        const remainingDays = daysToFinish % 7;
        const months = Math.floor(daysToFinish / 30);

        if (months > 0) {
            const remainingWeeks = Math.floor((daysToFinish % 30) / 7);
            return `${months} month${months > 1 ? 's' : ''}${remainingWeeks > 0 ? ` and ${remainingWeeks} week${remainingWeeks > 1 ? 's' : ''}` : ''}`;
        } else if (weeks > 0) {
            return `${weeks} week${weeks > 1 ? 's' : ''}${remainingDays > 0 ? ` and ${remainingDays} day${remainingDays > 1 ? 's' : ''}` : ''}`;
        } else {
            return `${daysToFinish} day${daysToFinish > 1 ? 's' : ''}`;
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-xl font-bold mb-4">Finish By Calculator</h1>

            <div className="mb-4">
                <label htmlFor="dailyWordCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Daily Word Count Goal
                </label>
                <input
                    type="number"
                    id="dailyWordCount"
                    value={dailyWordCount}
                    onChange={(e) => setDailyWordCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2 border border-gray-300 rounded"
                    min="0"
                    placeholder="0"
                />
            </div>

            <div className="mt-6 space-y-2">
                <p>Current progress: {currentWordCount} / {goalWordCount} words ({Math.round((currentWordCount / goalWordCount) * 100)}%)</p>
                <p>Words remaining: {goalWordCount - currentWordCount}</p>

                {daysToFinish > 0 && (
                    <>
                        <p>At {dailyWordCount} words per day, you&apos;ll finish in: <strong>{getTimeDescription()}</strong></p>
                        {finishDate && <p>Estimated completion date: <strong>{formatDate(finishDate)}</strong></p>}
                    </>
                )}

                {daysToFinish <= 0 && currentWordCount >= goalWordCount && (
                    <p className="text-green-600 font-bold">Congratulations! You&apos;ve reached your word count goal!</p>
                )}
            </div>
        </div>
    );
}