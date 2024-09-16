'use client'
import { Tree } from 'react-arborist';
import { useSimpleTree2 } from './useSimpleTree2';
import { useContext, useState } from 'react';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Item } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Button, TextField } from '@mui/material';
import Styles from './styles.module.css'
import { GlobalContext } from '@/components/GlobalContextProvider';

export const FileTree = ({ items }: { items: Item[] }) => {
    const [data, controller] = useSimpleTree2(items);
    const [newItemTitle, setNewItemTitle] = useState('');

    const handlePageButtonClick = () => {
        controller.onCreate({
            parentId: null,
            index: data.length,
            itemType: "PAGE",
            title: newItemTitle || "New Page"
        })
        setNewItemTitle('');
    }

    const handleFolderButtonClick = () => {
        controller.onCreate({
            parentId: null,
            index: data.length,
            itemType: "FOLDER",
            title: newItemTitle || "New Folder"
        })
        setNewItemTitle('');
    }

    return (
        <>
            <TextField
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                placeholder="Enter title"
                size="small"
            />
            <Button disabled={!newItemTitle} onClick={handlePageButtonClick}>Add Page</Button>
            <Button disabled={!newItemTitle} onClick={handleFolderButtonClick}>Add Folder</Button>

            {/* @ts-ignore */}
            <Tree openByDefault={false} data={data} {...controller} disableDrop={(node) => { return node.parentNode.data.itemType === "PAGE" }} selection='test'>{Node}</Tree>
        </>
    )
}

function Node({ node, style, dragHandle }: { node: any; style: any; dragHandle?: any }) {
    const { selectedItemId } = useContext(GlobalContext);
    const router = useRouter();

    const isPage = node.data.itemType === "PAGE"
    const isFolderEmpty = node.data.itemType === "FOLDER" && node.children.length === 0
    const isItemSelected = node.data.id === selectedItemId;

    return (
        <div
            className={`${isPage ? 'cursor-pointer' : ''} ${isFolderEmpty ? Styles.folderEmpty : ''} ${isItemSelected ? Styles.selected : ''}`}
            style={style} ref={dragHandle}
            onClick={() => isPage ? router.push(`/page/${node.data.id}`) : node.toggle()}
        >
            {isPage ? <DescriptionOutlinedIcon /> : <FolderOpenIcon />}
            {node.data.title}
        </div>
    );
}