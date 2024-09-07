'use client'

import { createContext, useState } from 'react';

interface IGlobalContextProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const GlobalContext = createContext<IGlobalContextProps>({
    isOpen: true,
    setIsOpen: () => { },
});

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
    // I can use useLocalStorage here to persist the state across sessions, but there's a hydration error...
    const [isOpen, setIsOpen] = useState(true);

    return (
        <GlobalContext.Provider
            value={{
                isOpen,
                setIsOpen,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};