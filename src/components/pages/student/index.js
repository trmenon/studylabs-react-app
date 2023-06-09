import React, {useEffect, useState} from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getLocalStorageByKey } from "../../../authentication/utils";
import { signoutUser } from "../../../authentication";
import { services } from "../../../services/api";
import logo from '../../../assets/logo.png';

// Legacy Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import { deepPurple } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import WidgetsIcon from '@mui/icons-material/Widgets';
import LogoutIcon from '@mui/icons-material/Logout';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';

// Constants
import { router_constants } from "../../../router/constants";
const drawerWidth = 220;

const StudentContainerComponent = ()=> {
    // Globals
    const navigate = useNavigate();

    // State
    const [state, setState] = useState({
        anchor: {elevation: null, open: false}
    })

    // Mounts
    useEffect(()=> {runPresets()}, [])

    // Authentication presets
    const runPresets = ()=> {
        const session = getLocalStorageByKey('user');
        if(session?.student === false) {
            // Signing out user
            signoutUser();
            try{
                services
                .userServices
                .signout()
                .subscribe({
                    next: (response)=> {
                        if(response?.success === true) {
                            console.log('Signout success');
                            navigate('/');
                        }
                    },
                    error: (error)=> {
                        console.log('Signout failed');
                        navigate('/');
                    },
                })
            }catch(err) {
                console.log('[ERROR] Signout ');
                console.log(err);
                navigate('/');
            }
        }
    }

    // Render utilities
    const getInitials = ()=> {
        const data = getLocalStorageByKey('user');
        const initials = `${data?.firstName[0]}${data?.lastName[0]}`;
        return initials;
    }

    // event Handlers
    const handleSignout = ()=> {
        signoutUser();
        try{
            services
            .userServices
            .signout()
            .subscribe({
                next: (response)=> {
                    if(response?.success === true) {
                        console.log('Signout success');
                        navigate('/');
                    }
                },
                error: (error)=> {
                    console.log('Signout failed');
                    navigate('/');
                },
            })
        }catch(err) {
            console.log('[ERROR] Signout ');
            console.log(err);
            navigate('/');
        }
    }

    const handleNavigate = (key)=> {
        handleCloseMenu();
        const route = router_constants?.student_routes[`${key}`]?.route;
        navigate(route);
    }

    const handleCloseMenu = ()=> setState({...state, anchor: {elevation: null, open: false}})
    const handleOpenMenu = (event)=> setState({...state, anchor: {elevation: event.currentTarget, open: true}})

    // Return Renderer
    return(
        <React.Fragment>
            <Menu
                anchorEl={state?.anchor['elevation']}
                open={state?.anchor['open']}
                onClose={handleCloseMenu}
                MenuListProps={{'aria-labelledby': 'basic-button',}}
            >
                <MenuItem onClick={()=> handleNavigate('home')}>Home</MenuItem>
                <MenuItem onClick={()=> handleNavigate('classes')}>Classes</MenuItem>
                <MenuItem onClick={()=> handleNavigate('wallet')}>Wallet</MenuItem>
            </Menu>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar 
                    position="fixed"
                    color = {'transparent'}
                    sx={{ 
                        width: {xs: `100%`, md: `calc(100% - ${drawerWidth}px)`}, 
                        ml: {xs: `0px`, md: `${drawerWidth}px`}, 
                        boxShadow: 'none',
                        borderBottom: '1px solid #ccc'
                    }}
                >
                    <Toolbar>
                        <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                            <img 
                                width = {'40px'}
                                height = {'40px'}
                                src={logo}
                                alt={'StudyLabs'}
                            />
                        </Box>
                        <Stack sx={{display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                            <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                                <Typography variant="h4">
                                    StudyLabs
                                </Typography>
                            </Box>
                            <Typography 
                                variant="subtitle" 
                                gutterBottom
                                sx={{color: '#003687', fontWeight: '400', fontStyle: 'italic'}}
                            >
                                Experience interactive learning through agile classrooms
                            </Typography>
                        </Stack>    
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                flexGrow: 1
                            }}
                        >
                            <Stack 
                                spacing = {'8px'} 
                                direction = {'row'} 
                                sx={{display: 'flex',alignItems: 'center',justifyContent: 'flex-end',}}
                            >
                                <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                                    <IconButton 
                                        color="primary" 
                                        onClick = {handleOpenMenu}
                                    >
                                        <WidgetsIcon />
                                    </IconButton>
                                </Box>
                                <Box>
                                    <IconButton 
                                        color="warning" 
                                        onClick = {handleSignout}
                                    >
                                        <LogoutIcon />
                                    </IconButton>
                                </Box>
                                <Box>
                                    <Avatar sx={{ bgcolor: deepPurple[500] }}>
                                        {getInitials()}
                                    </Avatar>
                                </Box>
                            </Stack>
                        </Box>                                    
                    </Toolbar>
                </AppBar>

                <Drawer
                    sx={{
                        width: {xs: 0, md: drawerWidth},
                        display: {xs: 'none', md: 'flex'},
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: {xs: 0, md: drawerWidth},
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <Box 
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            borderBottom: '1px solid #CCC',
                            height: '65px'
                        }}
                    >
                        <img 
                            width = {'40px'}
                            height = {'40px'}
                            src={logo}
                            alt={'StudyLabs'}
                        />
                        <Typography variant="h6">
                            StudyLabs
                        </Typography>
                    </Box>

                    <Box sx={{width: '100%'}}>
                        <List>
                            <ListItem disablePadding onClick = {()=>handleNavigate('home')}>
                                <ListItemButton>
                                    <ListItemIcon><HomeOutlinedIcon /></ListItemIcon>
                                    <ListItemText primary="Home" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding onClick = {()=>handleNavigate('classes')}>
                                <ListItemButton>
                                    <ListItemIcon><HistoryEduOutlinedIcon /></ListItemIcon>
                                    <ListItemText primary="Classes" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding onClick = {()=>handleNavigate('wallet')}>
                                <ListItemButton>
                                    <ListItemIcon><CreditCardOutlinedIcon /></ListItemIcon>
                                    <ListItemText primary="Wallet" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
                >
                    <Toolbar />
                    <Outlet/>
                </Box>
            </Box>            
        </React.Fragment>
    )
}

export default StudentContainerComponent;