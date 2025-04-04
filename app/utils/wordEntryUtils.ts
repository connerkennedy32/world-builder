import { WordEntry } from "@prisma/client";

export const convertWordEntriesToChartData = (wordEntries: WordEntry[]) => {
    // Create a dictionary with date as key and wordCount as value
    const wordCountByDate: Record<string, number> = {};

    // Populate the dictionary with word entries
    wordEntries.forEach((entry: WordEntry) => {
        const dateString = new Date(entry.date).toISOString();
        wordCountByDate[dateString] = entry.wordCount;
    });

    const allDates = wordEntries.map((entry: any) => new Date(entry.date).getTime());
    // Handle empty array case
    if (allDates.length === 0) {
        return [];
    }

    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));

    const daysDifference = Math.floor((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

    const chartData = [];

    for (let i = 0; i <= daysDifference; i++) {
        const interationDate = new Date(minDate);
        interationDate.setDate(minDate.getDate() + i);
        interationDate.setUTCHours(0, 0, 0, 0);

        const dateString = interationDate.toISOString();
        const wordCount = wordCountByDate[dateString] || null;
        chartData.push({ date: dateString, wordCount });
    }

    return chartData;
}