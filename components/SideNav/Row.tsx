'use client'
import { useState } from 'react'
import Styles from './styles.module.css'
import FolderIcon from '@mui/icons-material/Folder';
import { Button, Typography } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Popover from '@mui/material/Popover';
import { Page } from '@/types/pageTypes';

export default function Row({ page, handleNavigation, setNewPageValue }: { page: Page, handleNavigation: any, setNewPageValue: any }) {
    const [areChildrenShown, setAreChildrenShown] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<any>) => {
        setAnchorEl(event.currentTarget);
        setIsEditing(false);
    };

    const handleClose = (event: any) => {
        setAnchorEl(null);
        event.stopPropagation();
    };

    const isFolderType = !!page.pages;

    const handleEdit = (event: React.MouseEvent<any>) => {
        setNewTitle(page.title)
        setIsEditing(!isEditing);
        event.stopPropagation();
    }

    const handleDelete = async (event: React.MouseEvent<any>) => {
        event.stopPropagation();
        try {
            const response = await fetch(`/api/pages/${page.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (response) {
                setNewPageValue(response);
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
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div className={`${Styles.rowElement} ${open ? Styles.isBackgroundVisible : ''}`} onClick={isFolderType ? () => { } : () => handleNavigation(page.id)}>
            <div className={Styles.titleSpan} style={{ display: 'flex', alignItems: 'center' }}>
                {isFolderType ? <FolderIcon /> : <DescriptionOutlinedIcon sx={{ height: '20px' }} />}
                {!isEditing ?
                    <span onClick={isFolderType ? () => { setAreChildrenShown(!areChildrenShown) } : () => { }}>
                        {page.title}
                    </span> :
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Press Enter to submit"
                    />}
                <EditIcon aria-describedby={id} onClick={handleEdit} className={`${Styles.editIcon} ${open ? Styles.isIconVisible : ''}`} sx={{ height: '15px', marginLeft: 'auto' }} />
                {!isFolderType && <DeleteIcon aria-describedby={id} onClick={handleClick} className={`${Styles.editIcon} ${open ? Styles.isIconVisible : ''}`} sx={{ height: '15px' }} />}
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Typography sx={{ p: 2 }}>Delete &quot;{page.title}&quot;?</Typography>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDelete}>Delete</Button>
                </Popover>
            </div>
            {isFolderType && areChildrenShown &&
                [...(page.children || []), ...(page.pages || [])].map((page: any) => (
                    <Row key={`${isFolderType ? 'folder-' : 'page-'}-${page.id}`} page={page} handleNavigation={handleNavigation} setNewPageValue={setNewPageValue} />
                ))
            }
        </div>
    )
}