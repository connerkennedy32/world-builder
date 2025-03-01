'use client'

import { createContext, useState } from 'react';

interface IGlobalContextProps {
    selectedItemId: string;
    setSelectedItemId: (selectedItemId: string) => void;
    runTour: boolean;
    setRunTour: (runTour: boolean) => void;
}

export const GlobalContext = createContext<IGlobalContextProps>({
    selectedItemId: '',
    setSelectedItemId: () => { },
    runTour: true,
    setRunTour: () => { },
});

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
    // I can use useLocalStorage here to persist the state across sessions, but there's a hydration error...
    const [selectedItemId, setSelectedItemId] = useState('');
    const [runTour, setRunTour] = useState(false);
    return (
        <GlobalContext.Provider
            value={{
                selectedItemId,
                setSelectedItemId,
                runTour,
                setRunTour,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};