'use client'

import { createContext } from 'react';
import { useStopwatch } from '@/hooks/useStopwatch';

interface IStopwatchContextProps {
    seconds: number;
    minutes: number;
    isRunning: boolean;
    start: () => void;
    pause: () => void;
    reset: () => void;
}

export const StopwatchContext = createContext<IStopwatchContextProps>({
    seconds: 0,
    minutes: 0,
    isRunning: false,
    start: () => { },
    pause: () => { },
    reset: () => { },
});

export const StopwatchContextProvider = ({ children }: { children: React.ReactNode }) => {
    const {
        seconds,
        minutes,
        isRunning,
        start,
        pause,
        reset,
    } = useStopwatch();

    return (
        <StopwatchContext.Provider
            value={{
                seconds,
                minutes,
                isRunning,
                start,
                pause,
                reset,
            }}
        >
            {children}
        </StopwatchContext.Provider>
    );
};