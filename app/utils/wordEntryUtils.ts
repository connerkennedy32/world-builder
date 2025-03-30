import { WordEntry } from "@prisma/client";

export const convertWordEntriesToChartData = (wordEntries: WordEntry[]) => {
    // Populate missing dates with null values
    const allDates = wordEntries.map((entry: any) => new Date(entry.date).getTime());
    // Handle empty array case
    if (allDates.length === 0) {
        return [];
    }

    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));

    const chartData = [];
    let currentDate = new Date(minDate);

    while (currentDate <= maxDate) {
        const dateString = currentDate.toISOString();
        const wordCount = wordEntries.find((entry: any) => entry.date === dateString)?.wordCount || null;
        chartData.push({ date: dateString, wordCount });
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Sort the chart data by date
    chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return chartData;
}