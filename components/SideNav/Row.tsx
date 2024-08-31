'use client'
import { useState, useEffect } from 'react'
import Styles from './styles.module.css'
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Popover from '@mui/material/Popover';
import { Page } from '@/types/pageTypes';
import ContextMenu from './ContextMenu';
import { motion, Reorder, useMotionValue } from 'framer-motion';
import { useDeletePage, useUpdatePage, useUpdateFolder } from '@/hooks';
import { useQueryClient } from 'react-query';

export default function Row({ page, handleNavigation, currentId }: { page: Page, handleNavigation: any, currentId: any }) {
    const [areChildrenShown, setAreChildrenShown] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [childOrder, setChildOrder] = useState<Page[]>([...(page.children || []), ...(page.pages || [])]);
    const y = useMotionValue(0);
    const [isDragging, setIsDragging] = useState(false);
    const { mutate: deletePage, isSuccess: onDeleteSuccess } = useDeletePage();
    const { mutate: updatePage, isSuccess: onUpdatePageSuccess } = useUpdatePage();
    const { mutate: updateFolder, isSuccess: onUpdateFolderSuccess } = useUpdateFolder();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (onUpdatePageSuccess || onUpdateFolderSuccess) {
            setIsEditing(false);
        }
    }, [onUpdatePageSuccess, onUpdateFolderSuccess, queryClient, setIsEditing]);

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

    const isFolderType = 'pages' in page;
    const isFolderEmpty = isFolderType && page.pages?.length === 0 && page.children?.length === 0;

    const handleEditTitle = (event: React.MouseEvent<any>) => {
        setNewTitle(page.title);
        setIsEditing(!isEditing);
        setAnchorEl(null);
        event.stopPropagation();
    }

    const handleDeleteRow = async (event: React.MouseEvent<any>) => {
        event.stopPropagation();
        try {
            deletePage(page.id);
            if (onDeleteSuccess) {
                setAnchorEl(null);
            }

        } catch (error) {
            console.error(error);
        }
    }

    const handleAddToFolder = async (event: React.MouseEvent<any>) => {
        // event.stopPropagation();
        // event.preventDefault();
        // setAnchorEl(null);
    }

    const handleKeyPress = async (event: { key: string; }) => {
        if (event.key === 'Enter' && newTitle !== '') {
            if (isFolderType) {
                updateFolder({ folderId: String(page.id), title: newTitle });
            } else {
                updatePage({ page_id: String(page.id), title: newTitle });
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
                    {isFolderType ? <FolderIcon style={{ color: isFolderEmpty ? 'grey' : 'inherit' }} /> : <DescriptionOutlinedIcon sx={{ height: '20px' }} />}
                    {!isEditing ?
                        <span style={{ whiteSpace: 'nowrap' }}>
                            {truncateString(page.title)}
                        </span> :
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={handleKeyPress}
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
                        <ContextMenu rowId={String(page.id)} handleContextMenuClose={handleClose} fileType={isFolderType ? 'folder' : 'page'} onRenameButtonClick={handleEditTitle} onDeleteButtonClick={handleDeleteRow} onAddToFolderButtonClick={handleAddToFolder} />
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
                            />
                        ))}
                    </Reorder.Group>
                </motion.div>
            )}
        </Reorder.Item>
    )
}