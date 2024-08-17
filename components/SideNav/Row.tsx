'use client'
import { useState } from 'react'
import Styles from './styles.module.css'
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Popover from '@mui/material/Popover';
import { Page } from '@/types/pageTypes';
import { azeret_mono } from '@/app/fonts';
import ContextMenu from './ContextMenu';
import { motion, Reorder, useMotionValue } from 'framer-motion';

export default function Row({ page, handleNavigation, setNewPageValue, currentId }: { page: Page, handleNavigation: any, setNewPageValue: any, currentId: any }) {
    const [areChildrenShown, setAreChildrenShown] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [childOrder, setChildOrder] = useState<Page[]>([...(page.children || []), ...(page.pages || [])]);
    const y = useMotionValue(0);
    const [isDragging, setIsDragging] = useState(false);

    const handleDisplayFolderChildren = () => {
        if (!isDragging) {
            setAreChildrenShown(!areChildrenShown);
        }
    }

    const handleNavigationIfNotDragging = () => {
        if (!isDragging) {
            handleNavigation(page.id);
        }
    }

    function truncateString(str: string, length = 16) {
        if (str.length > length) {
            return str.slice(0, length) + '...';
        }
        return str;
    }

    const handleClose = (event: any) => {
        setAnchorEl(null);
        event.stopPropagation();
    };

    const isFolderType = !!page.pages;

    const handleEditTitle = (event: React.MouseEvent<any>) => {
        setNewTitle(page.title)
        setIsEditing(!isEditing);
        setAnchorEl(null);
        event.stopPropagation();
    }

    const handleDeleteRow = async (event: React.MouseEvent<any>) => {
        event.stopPropagation();
        try {
            const response = await fetch(`/api/pages/${page.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (response) {
                setNewPageValue(`${page.title} ${page.id}`);
                setAnchorEl(null);
            }

        } catch (error) {
            console.error(error);
        }
    }

    const handleKeyPress = async (event: { key: string; }) => {
        if (event.key === 'Enter' && newTitle !== '') {
            try {
                const response = await fetch(`/api/${isFolderType ? 'folders' : 'pages'}/${page.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title: newTitle })
                });
                if (response) {
                    setNewPageValue(newTitle);
                    setIsEditing(false);
                }

            } catch (error) {
                console.error(error);
            }
        }
    }

    const handleContextMenu = (event: any) => {
        if (isFolderType) {
            event.stopPropagation();
        }
        event.preventDefault();
        setAnchorEl(event.currentTarget);
        setIsEditing(false);
    }

    const isContextMenuOpen = !!anchorEl;
    const id = isContextMenuOpen ? 'simple-popover' : undefined;
    const isCurrentlySelected = Boolean(Number(currentId) === page.id && !isFolderType)


    return (
        <Reorder.Item
            value={page}
            id={page.id.toString()}
            className={`${Styles.rowElement} ${isDragging || isCurrentlySelected || isContextMenuOpen ? Styles.greyBackground : ''}`}
            style={{ y }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
        >
            <div
                onClick={isFolderType ? handleDisplayFolderChildren : handleNavigationIfNotDragging}
            >
                <div
                    className={Styles.titleSpan}
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    {isFolderType ? <FolderIcon /> : <DescriptionOutlinedIcon sx={{ height: '20px' }} />}
                    {!isEditing ?
                        <span className={azeret_mono.className} style={{ whiteSpace: 'nowrap' }}>
                            {truncateString(page.title)}
                        </span> :
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Press Enter to submit"
                        />}
                    <MoreVertIcon aria-describedby={id} onClick={handleContextMenu} className={`${Styles.editIcon} ${isContextMenuOpen ? Styles.isIconVisible : ''}`} sx={{ height: '20px', marginLeft: 'auto' }} />
                    <Popover
                        id={id}
                        open={isContextMenuOpen}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <ContextMenu fileType={isFolderType ? 'folder' : 'page'} onRenameButtonClick={handleEditTitle} onDeleteButtonClick={handleDeleteRow} />
                    </Popover>
                </div>
            </div>
            {isFolderType && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: areChildrenShown ? "auto" : 0, opacity: areChildrenShown ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                >
                    <Reorder.Group axis="y" values={childOrder} onReorder={setChildOrder}>
                        {childOrder.map((childPage: any) => (
                            <Row
                                currentId={currentId}
                                key={`${isFolderType ? 'folder-' : 'page-'}-${childPage.id}`}
                                page={childPage}
                                handleNavigation={handleNavigation}
                                setNewPageValue={setNewPageValue}
                            />
                        ))}
                    </Reorder.Group>
                </motion.div>
            )}
        </Reorder.Item>
    )
}