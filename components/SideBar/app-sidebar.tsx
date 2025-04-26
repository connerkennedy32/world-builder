'use client'
import { Home, Settings, ChartLine, Bot, BookOpen, ExternalLink, Clock, RotateCcw } from "lucide-react"
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
import { useContext, useState } from "react"
import { Tutorial } from "../Tutorial/Tutorial"
import { GlobalContext } from "../GlobalContextProvider"

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
    const {
        setRunTour,
        seconds,
        minutes,
        isRunning,
        start,
        pause,
        reset,
    } = useContext(GlobalContext);

    return (
        <Sidebar>
            <Tutorial />
            <SidebarContent id="sidebar-content">
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
                    <SidebarMenuItem className="cursor-pointer">
                        <SidebarMenuButton asChild>
                            <a onClick={() => setRunTour(true)}>
                                <BookOpen />
                                <span>Tutorial</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="cursor-pointer">
                        <SidebarMenuButton asChild>
                            <a onClick={() => window.open('https://forms.gle/roGp4N1gQjmUBda57', '_blank')}>
                                <ExternalLink />
                                <span>Submit Feedback</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="cursor-pointer">
                        <SidebarMenuButton asChild>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Clock />
                                {isRunning ? <span onClick={() => pause()}>Pause Stopwatch</span> : <span onClick={() => start()}>Start Stopwatch</span>}
                                <span>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
                                {!isRunning && (seconds > 0 || minutes > 0) && <span onClick={() => reset()}>
                                    <RotateCcw size={16} />
                                </span>}
                            </div>
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
                                <DropdownMenuItem onClick={() => signOut(() => {
                                    window.location.href = '/';
                                })}>
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
