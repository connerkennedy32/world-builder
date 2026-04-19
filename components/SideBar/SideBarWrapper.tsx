
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/SideBar/app-sidebar"
import { cookies } from "next/headers"
import { AIAssistantWrapper } from "@/components/AIAssistant/AIAssistantWrapper"
import { MainContentWrapper } from "@/components/AIAssistant/MainContentWrapper"

export async function SideBarWrapper({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <MainContentWrapper>
                <SidebarTrigger />
                {children}
            </MainContentWrapper>
            <AIAssistantWrapper />
        </SidebarProvider>
    )
}