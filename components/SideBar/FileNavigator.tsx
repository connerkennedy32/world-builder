import React, { useState } from "react"
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar"
import { FolderPlus, FilePlus, Plus } from "lucide-react"
import { FileTree } from "../FileTree/FileTree"
import { useSimpleTree2 } from "@/components/FileTree/useSimpleTree2"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
export function FileNavigator({ itemList }: { itemList: any }) {
    const [newItemTitle, setNewItemTitle] = useState('');
    const [data, controller] = useSimpleTree2(itemList);

    const [isFolderPopoverOpen, setIsFolderPopoverOpen] = useState(false);
    const [isPagePopoverOpen, setIsPagePopoverOpen] = useState(false);

    const handlePageButtonClick = () => {
        controller.onCreate({
            parentId: null,
            index: data.length,
            itemType: "PAGE",
            title: newItemTitle || "New Page"
        })
        setIsPagePopoverOpen(false)
        setNewItemTitle('');
    }

    const handleFolderButtonClick = () => {
        controller.onCreate({
            parentId: null,
            index: data.length,
            itemType: "FOLDER",
            title: newItemTitle || "New Folder"
        })
        setIsFolderPopoverOpen(false);
        setNewItemTitle('');
    }
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="flex gap-1 justify-between">
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">World Builder</span>
                <div className="flex gap-1">
                    <Popover open={isFolderPopoverOpen} onOpenChange={setIsFolderPopoverOpen}>
                        <PopoverTrigger><FolderPlus id="create-folder-button" className="cursor-pointer" size={20} /></PopoverTrigger>
                        <PopoverContent className="flex gap-2">
                            <Input placeholder="Folder Name" value={newItemTitle} onChange={(e) => setNewItemTitle(e.target.value)} />
                            <Button disabled={newItemTitle.length === 0} onClick={handleFolderButtonClick}>
                                <Plus />
                            </Button>
                        </PopoverContent>
                    </Popover>
                    <Popover open={isPagePopoverOpen} onOpenChange={setIsPagePopoverOpen}>
                        <PopoverTrigger><FilePlus id="create-page-button" className="cursor-pointer" size={20} /></PopoverTrigger>
                        <PopoverContent className="flex gap-2">
                            <Input placeholder="Page Name" value={newItemTitle} onChange={(e) => setNewItemTitle(e.target.value)} />
                            <Button disabled={newItemTitle.length === 0} onClick={() => {
                                handlePageButtonClick();
                            }}>
                                <Plus />
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>
            </SidebarGroupLabel>
            <SidebarGroupContent>
                {itemList && <FileTree data={data} controller={controller} />}
            </SidebarGroupContent>
        </SidebarGroup>
    )
}