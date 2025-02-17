"use client"

import { useContext } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/SideBar/app-sidebar"
import { GlobalContext } from "@/components/GlobalContextProvider";

export const SideBarWrapper = ({ children }: { children: React.ReactNode }) => {
    const { isOpen, setIsOpen } = useContext(GlobalContext)
    return (
        <SidebarProvider open={isOpen} onOpenChange={setIsOpen}>
            <AppSidebar />
            <div>
                <SidebarTrigger />
                {children}
            </div>
        </SidebarProvider>
    )
}