import { useState, useEffect, useCallback } from 'react';

interface StopwatchState {
    isRunning: boolean;
    startTime: number | null;
    elapsedTime: number;
}

export const useStopwatch = (storageKey: string = 'stopwatch') => {
    // Initialize with default values for server-side rendering
    const [state, setState] = useState<StopwatchState>({
        isRunning: false,
        startTime: null,
        elapsedTime: 0
    });

    // Track if we've hydrated from localStorage
    const [hydrated, setHydrated] = useState(false);

    // Load from localStorage on client-side only
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedState = localStorage.getItem(storageKey);
            if (savedState) {
                setState(JSON.parse(savedState));
            }
            setHydrated(true);
        }
    }, [storageKey]);

    const { isRunning, startTime, elapsedTime } = state;

    // Calculate total seconds and minutes
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const minutes = totalMinutes % 60;

    // Save to localStorage whenever state changes, but only after hydration
    useEffect(() => {
        if (typeof window !== 'undefined' && hydrated) {
            localStorage.setItem(storageKey, JSON.stringify(state));
        }
    }, [state, storageKey, hydrated]);

    // Update elapsed time while running
    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (isRunning && startTime) {
            intervalId = setInterval(() => {
                setState(prevState => ({
                    ...prevState,
                    elapsedTime: prevState.elapsedTime + (Date.now() - (prevState.startTime || 0)),
                    startTime: Date.now()
                }));
            }, 1000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isRunning, startTime]);

    // Start the timer
    const start = useCallback(() => {
        if (!isRunning) {
            setState(prevState => ({
                ...prevState,
                isRunning: true,
                startTime: Date.now()
            }));
        }
    }, [isRunning]);

    // Pause the timer
    const pause = useCallback(() => {
        if (isRunning) {
            setState(prevState => ({
                ...prevState,
                isRunning: false,
                elapsedTime: prevState.elapsedTime + (Date.now() - (prevState.startTime || 0)),
                startTime: null
            }));
        }
    }, [isRunning]);

    // Reset the timer
    const reset = useCallback(() => {
        setState({
            isRunning: false,
            startTime: null,
            elapsedTime: 0
        });
    }, []);

    return {
        isRunning,
        elapsedTime,
        totalSeconds,
        totalMinutes,
        seconds,
        minutes,
        start,
        pause,
        reset
    };
};
