'use client'
import { useState } from 'react'
import Styles from './styles.module.css'
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

export default function Row({ page, handleNavigation }: any) {
    const [areChildrenShown, setAreChildrenShown] = useState(true);

    const isFolderType = !!page.pages;

    return (
        <div className={Styles.rowElement} onClick={isFolderType ? () => { } : () => handleNavigation(page.id)}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {isFolderType ? <FolderIcon /> : <DescriptionOutlinedIcon sx={{ height: '20px' }} />}
                <span onClick={isFolderType ? () => { setAreChildrenShown(!areChildrenShown) } : () => { }}>
                    {page.title}
                </span>
            </div>
            {isFolderType && areChildrenShown &&
                page.children.map((page: any) => (
                    <Row key={`${isFolderType ? 'folder-' : 'page-'}-${page.id}`} page={page} handleNavigation={handleNavigation} />
                ))
            }
            {isFolderType && areChildrenShown &&
                page.pages.map((page: any) => (
                    <Row key={`${isFolderType ? 'folder-' : 'page-'}-${page.id}`} page={page} handleNavigation={handleNavigation} />
                ))
            }
        </div>
    )
}