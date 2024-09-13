'use client'

import { createContext, useState } from 'react';

interface IGlobalContextProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    selectedItemId: string;
    setSelectedItemId: (selectedItemId: string) => void;
}

export const GlobalContext = createContext<IGlobalContextProps>({
    isOpen: true,
    setIsOpen: () => { },
    selectedItemId: '',
    setSelectedItemId: () => { },
});

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
    // I can use useLocalStorage here to persist the state across sessions, but there's a hydration error...
    const [isOpen, setIsOpen] = useState(true);
    const [selectedItemId, setSelectedItemId] = useState('');
    return (
        <GlobalContext.Provider
            value={{
                isOpen,
                setIsOpen,
                selectedItemId,
                setSelectedItemId,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};