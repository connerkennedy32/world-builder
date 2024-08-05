'use client'
import { useState } from 'react'
import Styles from './styles.module.css'
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { Page } from '@/app/types/page';

export default function Row({ page, handleNavigation, setNewPageValue }: { page: Page, handleNavigation: any, setNewPageValue: any }) {
    const [areChildrenShown, setAreChildrenShown] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const isFolderType = !!page.pages;

    const handleEdit = () => {
        setNewTitle(page.title)
        setIsEditing(!isEditing);
    }

    const handleKeyPress = async (event: { key: string; }) => {
        if (event.key === 'Enter' && newTitle !== '') {
            try {
                const response = await fetch(`/api/pages/${page.id}`, {
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

    return (
        <div className={Styles.rowElement} onClick={isFolderType ? () => { } : () => handleNavigation(page.id)}>
            <div className={Styles.titleSpan} style={{ display: 'flex', alignItems: 'center' }}>
                {isFolderType ? <FolderIcon /> : <DescriptionOutlinedIcon sx={{ height: '20px' }} />}
                {!isEditing ? <span onClick={isFolderType ? () => { setAreChildrenShown(!areChildrenShown) } : () => { }}>
                    {page.title}
                </span> :
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Press Enter to submit"
                    />}
                {!isFolderType && <EditIcon onClick={handleEdit} className={Styles.editIcon} sx={{ height: '15px', marginLeft: 'auto' }} />}
            </div>
            {isFolderType && areChildrenShown &&
                page.children?.map((page: any) => (
                    <Row key={`${isFolderType ? 'folder-' : 'page-'}-${page.id}`} page={page} handleNavigation={handleNavigation} setNewPageValue={setNewPageValue} />
                ))
            }
            {isFolderType && areChildrenShown &&
                page.pages?.map((page: any) => (
                    <Row key={`${isFolderType ? 'folder-' : 'page-'}-${page.id}`} page={page} handleNavigation={handleNavigation} setNewPageValue={setNewPageValue} />
                ))
            }
        </div>
    )
}