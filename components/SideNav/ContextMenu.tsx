import * as React from 'react';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

interface ContextMenuProps {
    fileType: string;
    onRenameButtonClick: (event: React.MouseEvent<any>) => void;
    onDeleteButtonClick: (event: React.MouseEvent<any>) => void;
}

export default function ContextMenu({ fileType, onRenameButtonClick, onDeleteButtonClick }: ContextMenuProps) {
    const isFolderType = fileType === 'folder';
    return (
        <Paper sx={{ width: 200, maxWidth: '100%' }}>
            <MenuList>
                <MenuItem onClick={onRenameButtonClick}>
                    <ListItemIcon>
                        <DriveFileRenameOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Rename</ListItemText>
                </MenuItem>
                {!isFolderType && <MenuItem onClick={onDeleteButtonClick}>
                    <ListItemIcon>
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>}
            </MenuList>
        </Paper>
    );
}