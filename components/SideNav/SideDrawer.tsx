'use client'
import React, { useContext, useState } from 'react';
import { CircularProgress, Box, Drawer, CssBaseline, AppBar, Toolbar, Typography, Divider, Button, Skeleton, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { FileTree } from '../FileTree/FileTree';
import Chat from './Chat';
import { GlobalContext } from '../GlobalContextProvider';
import { useGetItemList } from '@/hooks';
import { useRouter } from 'next/navigation';
import { UserButton, ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
const drawerWidth = 240;

export default function SideDrawer({ children }: { children: React.ReactNode }) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { isOpen, setIsOpen, setSelectedItemId } = useContext(GlobalContext);
    const router = useRouter();
    const { data: itemList, isLoading, isError } = useGetItemList();

    const handleTrackerButtonClick = () => {
        setSelectedItemId('');
        router.push('/tracker');
    }

    const handleChatOpen = () => {
        setIsChatOpen(true);
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{ width: `calc(100% - ${isOpen ? drawerWidth : 0}px)` }}
            >
                <Chat open={isChatOpen} setOpen={setIsChatOpen} />
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton onClick={() => setIsOpen(!isOpen)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        World Builder
                    </Typography>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                        <AutoAwesomeIcon onClick={handleChatOpen} />
                        <ClerkLoaded>
                            <UserButton />
                        </ClerkLoaded>
                        <ClerkLoading>
                            <Skeleton variant="circular" width={30} height={30} />
                        </ClerkLoading>
                    </div>
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
                        onClick={handleTrackerButtonClick}
                    >
                        Tracker
                    </Button>
                </Toolbar>
                <Divider />
                {itemList && <FileTree items={itemList} />}
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    {isError && <div>Error fetching item list</div>}
                    {isLoading && <CircularProgress />}
                </div>
            </Drawer>}
            {children}
        </Box>
    );
}