import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { convertWordEntriesToChartData } from './wordEntryUtils';

const mockWordEntries = [
    {
        "id": 12,
        "wordCount": 22615,
        "date": new Date("2024-09-04T00:00:00.000Z"),
        "bookId": 1
    },
    {
        "id": 56,
        "wordCount": 41228,
        "date": new Date("2025-04-02T00:00:00.000Z"),
        "bookId": 1
    }
]

describe('convertWordEntriesToChartData', () => {
    it('should return an empty array if no word entries are provided', () => {
        const result = convertWordEntriesToChartData([]);
        expect(result).toEqual([]);
    });

    it('should return an array of objects with date and wordCount properties', () => {
        const result = convertWordEntriesToChartData(mockWordEntries);

        // Find the entry for April 2nd
        const april2ndEntry = result.find(entry =>
            entry.date.includes('2025-04-02')
        );

        expect(april2ndEntry).toBeDefined();
        expect(april2ndEntry?.wordCount).toEqual(41228);
        expect(result.length).toEqual(211);
    });
});