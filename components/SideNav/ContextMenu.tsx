import * as React from 'react';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

export default function ContextMenu() {
    return (
        <Paper sx={{ width: 320, maxWidth: '100%' }}>
            <MenuList>
                <MenuItem>
                    <ListItemIcon>
                        <DriveFileRenameOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Rename</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => console.log("TESTTEST")}>
                    <ListItemIcon>
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </MenuList>
        </Paper>
    );
}