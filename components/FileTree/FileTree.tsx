'use client'
import { Tree } from 'react-arborist';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Styles from './styles.module.css'
import { GlobalContext } from '@/components/GlobalContextProvider';
import { SidebarMenuItem } from "@/components/ui/sidebar"
import { TreeItem } from "@/types/itemTypes";
import { Folder, FolderOpen, FileText } from "lucide-react"


export const FileTree = ({ data, controller }: { data: readonly TreeItem[], controller: any }) => {
    return (
        <>  {/* @ts-ignore */}
            <Tree height={1000} openByDefault={false} data={data} {...controller} disableDrop={(node) => { return node.parentNode.data.itemType === "PAGE" }} selection='test'>{Node}</Tree>
        </>
    )
}

function Node({ node, style, dragHandle }: { node: any; style: any; dragHandle?: any }) {
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

    const { selectedItemId } = useContext(GlobalContext);
    const router = useRouter();

    const isPage = node.data.itemType === "PAGE"
    const isFolderEmpty = node.data.itemType === "FOLDER" && node.children.length === 0
    const isItemSelected = node.data.id === selectedItemId;

    const folderIcon = node.isOpen ? <FolderOpen size={20} /> : <Folder size={20} />

    return (
        <div
            className={`${isPage ? 'cursor-pointer' : ''} ${isFolderEmpty ? Styles.folderEmpty : ''} ${isItemSelected ? Styles.selected : ''}`}
            style={style} ref={dragHandle}
            onClick={() => isPage ? router.push(`/page/${node.data.id}`) : handleFolderToggle()}
        >
            <SidebarMenuItem key={node.data.title} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                {isPage ? <FileText size={20} /> : folderIcon}
                <span>{node.data.title}</span>
            </SidebarMenuItem>
        </div>
    );
}