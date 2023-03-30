import React, { useState, useEffect} from "react";
import logo from '../../../../assets/logo.png';
import { getLocalStorageByKey } from "../../../../authentication/utils";
import { services } from "../../../../services/api";

// Legacy Imports
import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

// Constants
const display_name = getLocalStorageByKey('user')?.firstName + " " + getLocalStorageByKey('user')?.lastName;
const USER_ID = getLocalStorageByKey('user')?._id;

const TutorWalletMount = ()=> {
    // State
    const [state, setState] = useState({
        credits: 0,
        toaster: {open: false, message: ''}
    });

    // Effects
    useEffect(()=> {fetchUserWallet()},[])
    useEffect(()=> {console.log(state)},[state])

    // API
    const fetchUserWallet = ()=> {
        try{
            services
            .walletServices
            .getUserWallet(USER_ID)
            .subscribe({
                next: (response)=> {
                    if(response && response?.success === true) {
                        setState({...state, credits: response?.data?.credits})
                    }
                },
                error: (error)=> {
                    console.log('[ERROR:API] Fetching wallet of tutor');
                    console.log(error);
                    setState({
                        ...state,
                        toaster: {
                            open: true,
                            message: `Server busy. Unable to get wallet information for ${display_name}`
                        }
                    })
                },
            })
        }catch(err) {
            console.log('[ERROR:API] Fetching wallet of tutor');
            console.log(err);
            setState({
                ...state,
                toaster: {
                    open: true,
                    message: `Unexpected error occured. Unable to get wallet information for ${display_name}`
                }
            })
        }
    }

    // Renderer
    return(
        <React.Fragment>
            <Snackbar
                open={state?.toaster['open']}
                autoHideDuration={3000}
                onClose={()=> setState({...state, toaster: {open: false, message: ''}})}
                message= {state?.toaster['message']}
            />

            <Box sx={{ display: 'block',textAlign: 'left',mb: '16px', width: '100%', position: 'static', mt: '8px'}}>
                <Typography sx={{fontSize: '24px', fontWeight: 600, color: '#1C1E26'}}>
                    My Wallet
                </Typography>
            </Box>
            <Divider />
            <Stack spacing={'32px'} sx={{width: '100%', mt: '32px'}}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                    <Paper 
                        variant={'outlined'}
                        sx={{
                            width: '320px',
                            height: '140px',
                            borderRadius: '16px',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'column',
                            background:'linear-gradient(45deg, #cc0000, #333333, #a93c3b, #a896a0, #7a3671, #bd1d65)'
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <img 
                                src = {logo}
                                width = {'24px'}
                                height = {'28px'}
                                alt = {'logo'}
                            />
                            <Typography sx={{fontSize: '20px', fontWeight: 900, color: '#FFFFFF'}}>
                                StudyLabs
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: '0.3'
                            }}
                        >
                            <Typography sx={{fontSize: '28px', fontWeight: 500, color: '#15b5e5'}}>
                                {display_name}
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
                <Box 
                    sx={{
                        width: '320px',
                        mt: '16px', 
                        height: '125px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column'
                    }}
                >
                    <Typography sx={{fontSize: '20px', fontWeight: 500, color: '#1C1E26'}}>
                        Outstanding Credits
                    </Typography>
                    <Typography sx={{fontSize: '36px', fontWeight: 900, color: '#040620'}}>
                        {state?.credits}
                    </Typography>
                </Box>
            </Stack>
        </React.Fragment>
    )
}

export default TutorWalletMount;