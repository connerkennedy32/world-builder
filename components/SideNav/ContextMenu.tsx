import * as React from 'react';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import Popover from '@mui/material/Popover';

interface ContextMenuProps {
    fileType: string;
    onRenameButtonClick: (event: React.MouseEvent<any>) => void;
    onDeleteButtonClick: (event: React.MouseEvent<any>) => void;
    onAddToFolderButtonClick: (event: React.MouseEvent<any>) => void;
}

export default function ContextMenu({ fileType, onRenameButtonClick, onDeleteButtonClick, onAddToFolderButtonClick }: ContextMenuProps) {
    const isFolderType = fileType === 'folder';
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handleAddToFolderClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        // event.stopPropagation();
        onAddToFolderButtonClick(event);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'folder-popover' : undefined;

    const folderList = ['Folder 1', 'Folder 2', 'Folder 3', 'Folder 4', 'Folder 5'];

    return (
        <Paper sx={{ width: 200, maxWidth: '100%' }}>
            <MenuList>
                <MenuItem className='doNotCloseSideDrawer' onClick={onRenameButtonClick}>
                    <ListItemIcon>
                        <DriveFileRenameOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Rename</ListItemText>
                </MenuItem>
                {!isFolderType && <MenuItem className='doNotCloseSideDrawer' onClick={onDeleteButtonClick}>
                    <ListItemIcon>
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>}
                <MenuItem className='doNotCloseSideDrawer' onClick={handleAddToFolderClick}>
                    <ListItemIcon>
                        <CreateNewFolderOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Add To Folder</ListItemText>
                </MenuItem>
            </MenuList>
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
                <Paper>
                    <MenuList>
                        {folderList.map((folder, index) => (
                            <MenuItem key={index} onClick={handleClose}>
                                <ListItemText>{folder}</ListItemText>
                            </MenuItem>
                        ))}
                    </MenuList>
                </Paper>
            </Popover>
        </Paper>
    );
}