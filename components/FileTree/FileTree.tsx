'use client'
import { Tree } from 'react-arborist';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Styles from './styles.module.css'
import { GlobalContext } from '@/components/GlobalContextProvider';
import { SidebarMenuAction, SidebarMenuItem } from "@/components/ui/sidebar"
import { TreeItem } from "@/types/itemTypes";
import { Folder, FolderOpen, FileText, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const FileTree = ({ data, controller }: { data: readonly TreeItem[], controller: any }) => {
    return (
        <>  {/* @ts-ignore */}
            <Tree width={240} openByDefault={false} data={data} {...controller} disableDrop={(node) => { return node.parentNode.data.itemType === "PAGE" }} selection='test'>
                {(props) => <Node {...props} controller={controller} />}
            </Tree>
        </>
    )
}

function Node({ node, style, dragHandle, controller }: { node: any; style: any; dragHandle?: any; controller: any }) {
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

    const folderIcon = node.isOpen ? <FolderOpen size={20} /> : <Folder size={20} />

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
            className={`${isPage ? 'cursor-pointer' : ''} ${isFolderEmpty ? Styles.folderEmpty : ''} ${isItemSelected ? Styles.selected : ''}`}
            style={style} ref={dragHandle}
        >
            <SidebarMenuItem
                key={node.data.title}
                style={{ display: 'flex', alignItems: 'center' }}
                onClick={handleItemClick}
            >
                {isPage ? <FileText size={20} /> : folderIcon}
                {isRenaming ? <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter new name"
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
                /> : <span>{node.data.title}</span>}
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