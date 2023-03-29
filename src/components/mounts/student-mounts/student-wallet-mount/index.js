import React, { Component} from "react";

// Utilities
import { getLocalStorageByKey } from "../../../../authentication/utils";

// Services
import { services } from "../../../../services/api";

// Legacy Imports
import Snackbar from '@mui/material/Snackbar';
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
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined';

// HOC Imports
import { CustomTextField } from "../../../common";

class StudentWalletMount extends Component {
    constructor(props) {
        super(props);
        this.state={
            walletId: '',
            wallet: {exist: false, credits: 0},
            toaster: {open: false, message: ''},
            openModal: false,
        }
    }

    // Lifecycle Methods
    componentDidMount(){ this.fetchUserWallet()}
    componentDidUpdate() {
        console.log('[Update] Wallet mount-Student');
        console.log(this.state);
    }

    // APIs
    fetchUserWallet = ()=> {
        try{
            services
            .walletServices
            .getUserWallet(getLocalStorageByKey('user')?._id)
            .subscribe({
                next: (response)=> {
                    if(response && response?.success === true && response?.data) {
                        this.setState({
                            ...this.state,
                            walletId: response?.data?._id,
                            wallet: {exist: true, credits: response?.data?.credits},
                            toaster: {open: true, message: 'Wallet has been updated'},
                            openModal: false,
                        })
                    }else {
                        this.setState({...this.state, toaster: {open: true, message: 'You do not have a wallet'}})
                    }
                },
                error: (error)=> {
                    console.log('[ERROR] Fetching user wallet');
                    console.log(error);
                    this.setState({...this.state, toaster: {open: true, message: 'Server busy. Please try after sometime'}})
                },
            })
        }catch(err) {
            console.log('[ERROR] Fetching user wallet');
            console.log(err);
            this.setState({...this.state, toaster: {open: true, message: 'Unexpected error occured. Please try after sometime'}})
        }
    }
    createWallet = ()=> {
        const payload = {
            credits: this.state?.wallet['credits'], 
            userId: getLocalStorageByKey('user')?._id
        };

        try{
            services
            .walletServices
            .createNewWallet(payload)
            .subscribe({
                next: (response)=> {
                    if(response && response?.success === true) {
                        this.fetchUserWallet();
                    }else {
                        this.setState({...this.state, toaster: {open: true, message: 'Unable to create wallet at the moment. Please try after sometime.'}})
                    }
                },
                error: (error)=> {
                    console.log('[ERROR] Creating user wallet');
                    console.log(error);
                    this.setState({...this.state, toaster: {open: true, message: 'Server busy. Please try after sometime'}})
                },
            })
        }catch(err) {
            console.log('[ERROR: API] Creating user wallet');
            console.log(err);
            this.setState({...this.state, toaster: {open: true, message: 'Unexpected error occured. Please try after sometime'}})
        }
    }
    updateCredits = ()=> {
        const payload = { credits: this.state?.wallet?.credits}
        try{
            services
            .walletServices
            .updateWalletCredits(this.state?.walletId, payload)
            .subscribe({
                next:(response)=> {
                    if(response && response?.success === true) {
                        this.fetchUserWallet()
                    }else {
                        this.setState({...this.state, toaster: {open: true, message: 'Unable to process at the moment. Please try after sometime'}})
                    }
                },
                error:(error)=> {
                    console.log('[ERROR] Depositing credits to wallet');
                    console.log(error);
                    this.setState({...this.state, toaster: {open: true, message: 'Server busy. Please try after sometime'}})
                },
            })
        }catch(err) {
            console.log('[ERROR:API] Depositing credits to wallet');
            console.log(err);
            this.setState({...this.state, toaster: {open: true, message: 'Unexpected error occured. Please try after sometime'}})
        }
    }

    // Event Handlers
    openModal = ()=> this.setState({...this.state, openModal: true});
    closeModal = ()=> this.setState({...this.state, openModal: false});
    closeSnackbar = ()=> this.setState({...this.state, toaster: {open: false, message: ''},})

    // Renderer
    render() {
        return(
            <React.Fragment>
                <Snackbar
                    open={this.state?.toaster['open']}
                    autoHideDuration={3000}
                    onClose={this.closeSnackbar}
                    message= {this.state?.toaster['message']}
                />
                <Dialog 
                    open={this.state?.openModal} 
                    onClose={this.closeModal} 
                    sx={{'& .MuiDialog-paper': {borderRadius: '24px',py: '16px'},}}
                >
                    <DialogTitle sx={{borderBottom: '1px solid #CCC', mb: '16px'}}>
                        Create Your StudyLabs Wallet
                    </DialogTitle>
                    <DialogContent sx={{py: '16px'}}>
                        <CustomTextField
                            name = {'credits'}
                            type = {'number'}
                            label = {'First Deposit'}
                            placeholder = {'Enter first deposit amount'}
                            value = {this.state?.wallet[`credits`].toString()}
                            disabled = {false}
                            required = {true}
                            error = {false}
                            helperText = {'Remember to enter valid amount'}
                            changeHandler = {({field, value})=>this.setState({...this.state, wallet: {...this.state.wallet, credits: parseInt(value)}})}
                        />
                    </DialogContent>
                    <DialogActions sx={{mt: '16px', px: '32px'}}>
                        <Button 
                            variant="outlined" 
                            endIcon={<AddOutlinedIcon />}
                            color={'primary'}     
                            disabled = {isNaN(parseInt(this.state?.wallet['credits']))? true: false}  
                            onClick = {()=> {
                               if (this.state?.wallet['exist'] === true) {
                                    this.updateCredits()
                               }else{
                                this.createWallet()
                               }
                            }}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
                {
                    this.state?.wallet['exist'] === false?
                        <Box 
                            sx={{
                                width: '100%',
                                height: '65vh',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column'
                            }}
                        >
                            <Button 
                                variant="contained" 
                                endIcon={<AddOutlinedIcon />}
                                color={'info'}                        
                                onClick = {this.openModal}
                            >
                                Create your wallet 
                            </Button>
                            <Box sx={{width:'100%', mt: '16px'}}>
                                <Typography sx={{fontSize: '20px', fontWeight: 600, color: '#18aedb'}}>
                                    You currently do not have a wallet
                                </Typography>
                            </Box>  
                        </Box>
                        :
                        <Stack
                            spacing={'24px'}
                            sx={{
                                width: '100%',
                                px: {xs: '8px', sm: '12px', md: '24px', lg: '32px', xl: '48px'},
                                mt: '24px'
                            }}
                        >
                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                                <Button 
                                    variant="contained" 
                                    endIcon={<AddOutlinedIcon />}
                                    color={'info'}                        
                                    onClick = {this.openModal}
                                >
                                    Top up
                                </Button>
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <Paper 
                                    variant={'outlined'}
                                    sx={{
                                        width: '80%',
                                        height: '380px',
                                        borderRadius: '28px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        // backgroundColor: '#0288d1'
                                        background:'linear-gradient(45deg, #cc0000, #333333, #a93c3b, #a896a0, #7a3671, #bd1d65)'
                                    }}
                                >
                                    <Stack direction = {{xs: 'column', md: 'row'}} spacing={4}>
                                        <CurrencyRupeeOutlinedIcon sx={{fontSize: '296px'}}/>
                                        <Typography sx={{fontWeight: 700, color: '#FFF'}}>
                                            {`${this.state?.wallet['credits']} credits remaining`}
                                        </Typography>
                                    </Stack>
                                </Paper>
                            </Box>
                        </Stack>
                }
            </React.Fragment>
        )
    }
};

export default StudentWalletMount;