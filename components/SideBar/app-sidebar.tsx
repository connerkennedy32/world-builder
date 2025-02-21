'use client'
import { Home, Settings, ChartLine, Bot } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useGetItemList } from "@/hooks"
import { FileNavigator } from "./FileNavigator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User2 } from "lucide-react"
import { ChevronUp } from "lucide-react"
import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from "next/navigation"
import AIChat from "../AIChat/Chat"
import { useState } from "react"

const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: 'Tracker',
        url: '/tracker',
        icon: ChartLine,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    }
]

export function AppSidebar() {
    const { data: itemList } = useGetItemList();
    const router = useRouter();
    const { user } = useUser();
    const { signOut } = useClerk();
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <Sidebar>
            <SidebarContent>
                {itemList && <FileNavigator itemList={itemList} />}
            </SidebarContent>
            <AIChat open={isChatOpen} setOpen={setIsChatOpen} />
            <SidebarFooter>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem className="cursor-pointer" key={item.title}>
                            <SidebarMenuButton asChild>
                                <a onClick={() => router.push(item.url)}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    <SidebarMenuItem className="cursor-pointer">
                        <SidebarMenuButton asChild>
                            <a onClick={() => setIsChatOpen(true)}>
                                <Bot />
                                <span>AI Thesaurus</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> {user?.emailAddresses[0]?.emailAddress}
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span onClick={() => signOut()}>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
