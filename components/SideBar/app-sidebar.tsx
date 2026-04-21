'use client'
import { Home, ChartLine, Bot, Clock, RotateCcw, FolderPlus, FilePlus, Plus } from "lucide-react"
import {
    Sidebar,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useGetItemList } from "@/hooks"
import { FileNavigator } from "./FileNavigator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User2, ChevronUp } from "lucide-react"
import { useRouter } from "next/navigation"
import AIChat from "../AIChat/Chat"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useContext, useState } from "react"
import { Tutorial } from "../Tutorial/Tutorial"
import { StopwatchContext } from "../StopwatchContextProvider"
import { useSimpleTree2 } from "@/components/FileTree/useSimpleTree2"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const items = [
    { title: "Home", url: "/", icon: Home },
    { title: 'Tracker', url: '/tracker', icon: ChartLine },
]

function FileSection({ itemList }: { itemList: any[] }) {
    const [data, controller] = useSimpleTree2(itemList);
    const [newItemTitle, setNewItemTitle] = useState('');
    const [isFolderPopoverOpen, setIsFolderPopoverOpen] = useState(false);
    const [isPagePopoverOpen, setIsPagePopoverOpen] = useState(false);

    const handlePageButtonClick = () => {
        controller.onCreate({ parentId: null, index: data.length, itemType: "PAGE", title: newItemTitle || "New Page" });
        setIsPagePopoverOpen(false);
        setNewItemTitle('');
    }

    const handleFolderButtonClick = () => {
        controller.onCreate({ parentId: null, index: data.length, itemType: "FOLDER", title: newItemTitle || "New Folder" });
        setIsFolderPopoverOpen(false);
        setNewItemTitle('');
    }

    return (
        <>
            <div className="flex items-center justify-between px-3 h-8 border-b border-sidebar-border/50 shrink-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 truncate">Pages</span>
                <div className="flex items-center gap-0.5">
                    <Popover open={isFolderPopoverOpen} onOpenChange={setIsFolderPopoverOpen}>
                        <PopoverTrigger asChild>
                            <button id="create-folder-button" className="p-1 rounded hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors">
                                <FolderPlus size={15} />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="flex gap-2 w-64">
                            <Input autoFocus placeholder="Folder name" value={newItemTitle} onChange={(e) => setNewItemTitle(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && newItemTitle.length > 0) handleFolderButtonClick(); }} />
                            <Button disabled={newItemTitle.length === 0} onClick={handleFolderButtonClick} size="sm"><Plus size={14} /></Button>
                        </PopoverContent>
                    </Popover>
                    <Popover open={isPagePopoverOpen} onOpenChange={setIsPagePopoverOpen}>
                        <PopoverTrigger asChild>
                            <button id="create-page-button" className="p-1 rounded hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors">
                                <FilePlus size={15} />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="flex gap-2 w-64">
                            <Input autoFocus placeholder="Page name" value={newItemTitle} onChange={(e) => setNewItemTitle(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && newItemTitle.length > 0) handlePageButtonClick(); }} />
                            <Button disabled={newItemTitle.length === 0} onClick={handlePageButtonClick} size="sm"><Plus size={14} /></Button>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="relative flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <FileNavigator data={data} controller={controller} />
                </ScrollArea>
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-sidebar to-transparent z-10" />
            </div>
        </>
    )
}

export function AppSidebar() {
    const { data: itemList } = useGetItemList();
    const router = useRouter();
    const [isChatOpen, setIsChatOpen] = useState(false);

    const { seconds, minutes, isRunning, start, pause, reset } = useContext(StopwatchContext);

    return (
        <Sidebar>
            <Tutorial />
            {itemList && <FileSection itemList={itemList} />}
            <AIChat open={isChatOpen} setOpen={setIsChatOpen} />
            <SidebarFooter className="border-t border-sidebar-border pt-1 bg-sidebar-accent/30">
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
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="shrink-0" />
                                <span className="flex-1" onClick={() => isRunning ? pause() : start()}>
                                    {isRunning ? 'Pause' : 'Start'} Stopwatch
                                </span>
                                <span className="text-xs tabular-nums text-sidebar-foreground/60">
                                    {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                                </span>
                                {!isRunning && (seconds > 0 || minutes > 0) && (
                                    <span onClick={() => reset()} className="shrink-0">
                                        <RotateCcw size={14} />
                                    </span>
                                )}
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> connerkennedy32@gmail.com
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem><span>Account</span></DropdownMenuItem>
                                <DropdownMenuItem><span>Sign out</span></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
