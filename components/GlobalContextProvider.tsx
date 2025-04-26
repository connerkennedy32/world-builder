'use client'

import { createContext, useState } from 'react';
import { useStopwatch } from '@/hooks/useStopwatch';

interface IGlobalContextProps {
    selectedItemId: string;
    setSelectedItemId: (selectedItemId: string) => void;
    runTour: boolean;
    setRunTour: (runTour: boolean) => void;
    seconds: number;
    minutes: number;
    isRunning: boolean;
    start: () => void;
    pause: () => void;
}

export const GlobalContext = createContext<IGlobalContextProps>({
    selectedItemId: '',
    setSelectedItemId: () => { },
    runTour: true,
    setRunTour: () => { },
    seconds: 0,
    minutes: 0,
    isRunning: false,
    start: () => { },
    pause: () => { },
});

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
    // I can use useLocalStorage here to persist the state across sessions, but there's a hydration error...
    const [selectedItemId, setSelectedItemId] = useState('');
    const [runTour, setRunTour] = useState(false);
    const {
        seconds,
        minutes,
        isRunning,
        start,
        pause,
    } = useStopwatch();

    return (
        <GlobalContext.Provider
            value={{
                selectedItemId,
                setSelectedItemId,
                runTour,
                setRunTour,
                seconds,
                minutes,
                isRunning,
                start,
                pause,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};