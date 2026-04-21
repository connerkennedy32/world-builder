'use client'
import { Tree } from 'react-arborist';
import { useContext, useEffect, useReducer, useState } from 'react';
import { useRouter } from 'next/navigation';
import Styles from './styles.module.css'
import { GlobalContext } from '@/components/GlobalContextProvider';
import { SidebarMenuAction, SidebarMenuItem } from "@/components/ui/sidebar"
import { TreeItem } from "@/types/itemTypes";
import { Folder, FolderOpen, FileText, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ROW_HEIGHT = 26;

function countVisibleNodes(items: readonly TreeItem[]): number {
    return items.reduce((sum, item) => {
        const isOpen = typeof window !== 'undefined' && !!window.localStorage.getItem(item.id);
        return sum + 1 + (isOpen ? countVisibleNodes(item.children ?? []) : 0);
    }, 0);
}

export const FileTree = ({ data, controller }: { data: readonly TreeItem[], controller: any }) => {
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const treeHeight = Math.max(countVisibleNodes(data) * ROW_HEIGHT, ROW_HEIGHT);

    return (
        <div className={`w-full ${Styles.treeWrapper}`}>  {/* @ts-ignore */}
            <Tree width="100%" height={treeHeight} rowHeight={ROW_HEIGHT} openByDefault={false} data={data} {...controller} disableDrop={(node) => { return node.parentNode.data.itemType === "PAGE" }} selection='test'>
                {(props) => <Node {...props} controller={controller} onToggle={forceUpdate} />}
            </Tree>
        </div>
    )
}

function Node({ node, style, dragHandle, controller, onToggle }: { node: any; style: any; dragHandle?: any; controller: any; onToggle: () => void }) {
    const [isRenaming, setIsRenaming] = useState(false);
    const [newTitle, setNewTitle] = useState(node.data.title);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleFolderToggle = () => {
        if (node.isOpen) {
            window.localStorage.removeItem(node.id);
            node.close();
        } else {
            window.localStorage.setItem(node.id, 'true');
            node.open();
        }
        onToggle();
    }

    useEffect(() => {
        if (window.localStorage.getItem(node.id)) {
            node.open();
        }
    }, [node])

    const { selectedItemId, setSelectedItemId } = useContext(GlobalContext);
    const router = useRouter();

    const isPage = node.data.itemType === "PAGE"
    const isFolderEmpty = node.data.itemType === "FOLDER" && node.children.length === 0
    const isItemSelected = node.data.id === selectedItemId;

    const folderIcon = node.isOpen ? <FolderOpen size={16} /> : <Folder size={16} />

    const handleItemClick = () => {
        if (isPage) {
            setSelectedItemId(node.data.id);
            router.push(`/page/${node.data.id}`);
        } else {
            handleFolderToggle();
        }
    }

    return (
        <div
            className={`${isPage ? 'cursor-pointer' : 'cursor-default'} ${isFolderEmpty ? Styles.folderEmpty : ''} ${isItemSelected ? Styles.selected : ''}`}
            style={style} ref={dragHandle}
        >
            <SidebarMenuItem
                key={node.data.title}
                className="flex items-center gap-1.5 rounded-md text-sm"
                onClick={handleItemClick}
            >
                <span className="text-sidebar-foreground/60 shrink-0">
                    {isPage ? <FileText size={16} /> : folderIcon}
                </span>
                {isRenaming ? <input
                    autoFocus
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter new name"
                    className="flex-1 bg-transparent border-b border-sidebar-border outline-none text-sm px-0.5"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            controller.onRename({ id: node.data.id, name: newTitle, node: node });
                            setIsRenaming(false);
                        }
                        if (e.key === ' ' || e.key === 'Backspace') {
                            e.stopPropagation();
                        }
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                /> : <span className="truncate">{node.data.title}</span>}
            </SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuAction style={{ marginTop: "-6px" }}>
                        <MoreHorizontal />
                    </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="center">
                    <DropdownMenuItem onSelect={(e) => {
                        e.stopPropagation();
                        setIsRenaming(true);
                    }}>
                        <span>Rename</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => {
                        setShowDeleteDialog(true);
                    }}>
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;{node.data.title}&quot;? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                controller.onDelete({ ids: [node.data.id], source: "confirm_modal" });
                                setShowDeleteDialog(false);
                            }}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
