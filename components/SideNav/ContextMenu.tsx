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
import useGetFolderList from '@/hooks/useGetFolderList';
import useUpdateFolder from '@/hooks/useUpdateFolder';
import useUpdatePage from '@/hooks/useUpdatePage';

interface ContextMenuProps {
    fileType: string;
    onRenameButtonClick: (event: React.MouseEvent<any>) => void;
    onDeleteButtonClick: (event: React.MouseEvent<any>) => void;
    onAddToFolderButtonClick: (event: React.MouseEvent<any>) => void;
    handleContextMenuClose: (event: React.MouseEvent<any>) => void;
    rowId: string;
}

export default function ContextMenu({ rowId, fileType, onRenameButtonClick, onDeleteButtonClick, onAddToFolderButtonClick, handleContextMenuClose }: ContextMenuProps) {
    const isFolderType = fileType === 'folder';
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const { data: folderList, isLoading: folderListLoading, error: folderListError } = useGetFolderList();
    const { mutate: addFolderToFolder } = useUpdateFolder();
    const { mutate: addPageToFolder } = useUpdatePage();

    const handleAddToFolderClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        onAddToFolderButtonClick(event);
    };

    const handleFolderSelect = (event: React.MouseEvent<HTMLElement>, folderId: number) => {
        if (fileType === 'folder') {
            addFolderToFolder({ folderId: rowId, parentId: folderId });
        } else {
            addPageToFolder({ page_id: rowId, parentId: folderId });
        }
        handleClose(event);
    };

    const handleClose = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(null);
        handleContextMenuClose(event);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'folder-popover' : undefined;

    if (folderListLoading) return <div>Loading...</div>;
    if (folderListError) return <div>Error</div>;

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
                        {folderList.folders.map((folder: any, index: any) => (
                            <MenuItem key={index} onClick={(event) => handleFolderSelect(event, folder.id)}>
                                <ListItemText>{folder.title}</ListItemText>
                            </MenuItem>
                        ))}
                    </MenuList>
                </Paper>
            </Popover>
        </Paper>
    );
}