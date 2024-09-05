'use client'
import { Tree } from 'react-arborist';
import { useSimpleTree2 } from './useSimpleTree2';
import { useEffect, useState } from 'react';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Item } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Button, TextField } from '@mui/material';

export const FileTree = ({ items }: { items: Item[] }) => {
    const [data, controller] = useSimpleTree2(items);
    const [newItemTitle, setNewItemTitle] = useState('');

    // useEffect(() => {
    //     console.log(data)
    // }, [data])

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
            <Tree data={data} {...controller} disableDrop={(node) => { return node.parentNode.data.itemType === "PAGE" }}>{Node}</Tree>
        </>
    )
}

function Node({ node, style, dragHandle }: { node: any; style: any; dragHandle?: any }) {
    const router = useRouter();

    const isPage = node.data.itemType === "PAGE"

    return (
        <div style={style} ref={dragHandle} onClick={() => isPage ? router.push(`/page/${node.data.id}`) : node.toggle()}>
            {isPage ? <DescriptionOutlinedIcon /> : <FolderIcon />}
            {node.data.title}
        </div>
    );
}