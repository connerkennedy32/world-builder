'use client'
import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { FileTree } from '../FileTree/FileTree';
import { GlobalContext } from '../GlobalContextProvider';
import { useGetItemList } from '@/hooks';
import { useRouter } from 'next/navigation';
const drawerWidth = 240;

export default function SideDrawer({ children }: { children: React.ReactNode }) {
    const { isOpen, setIsOpen } = useContext(GlobalContext);
    const router = useRouter();
    const { data: itemList } = useGetItemList();
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{ width: `calc(100% - ${isOpen ? drawerWidth : 0}px)` }}
            >
                <Toolbar>
                    <IconButton onClick={() => setIsOpen(!isOpen)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        World Builder
                    </Typography>
                </Toolbar>
            </AppBar>
            {isOpen && <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ margin: '1rem', width: '90%' }}
                        onClick={() => router.push('/tracker')}
                    >
                        Tracker
                    </Button>
                </Toolbar>
                <Divider />
                {itemList && <FileTree items={itemList} />}
            </Drawer>}
            {children}
        </Box>
    );
}