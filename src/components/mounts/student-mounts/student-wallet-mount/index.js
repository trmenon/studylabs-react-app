import React, { Component} from "react";
import logo from '../../../../assets/logo.png';
import payment from '../../../../assets/payment.jpg';
import { MasterCardIcon, VisaCardIcon, MaestroCardIcon } from "../../../common/svg-icons";

// Utilities
import { getLocalStorageByKey } from "../../../../authentication/utils";

// Services
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

// HOC Imports
import { CustomTextField } from "../../../common";

// Constants
const display_name = getLocalStorageByKey('user')?.firstName + " " + getLocalStorageByKey('user')?.lastName;

class StudentWalletMount extends Component {
    constructor(props) {
        super(props);
        this.state={
            walletId: '',
            credits: 0,
            modal: {open: false, credits: 0},
            mock_data: {card_number: '',cvv: '', service: ''},
            toaster: {open: false, message: ''},
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
                            credits: response?.data?.credits,
                            openModal: false,
                        })
                    }else {
                        this.setState({
                            ...this.state, 
                            toaster: {
                                open: true, 
                                message: response?.message || 'Unable to process your data at the moment. Please try after sometime'
                            }
                        });
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
    updateCredits = ()=> {
        const payload = { credits: this.state?.modal?.credits}
        try{
            services
            .walletServices
            .updateWalletCredits(this.state?.walletId, payload)
            .subscribe({
                next:(response)=> {
                    if(response && response?.success === true) {
                        this.fetchUserWallet();
                        this.closeModal();
                    }else {
                        this.setState({
                            ...this.state, 
                            toaster: {
                                open: true, 
                                message: 'Unable to process at the moment. Please try after sometime'
                            }
                        }, ()=> this.closeModal())
                    }
                },
                error:(error)=> {
                    console.log('[ERROR] Depositing credits to wallet');
                    console.log(error);
                    this.setState({
                        ...this.state, 
                        toaster: {open: true, message: 'Server busy. Please try after sometime'}
                    }, ()=> this.closeModal())
                },
            })
        }catch(err) {
            console.log('[ERROR:API] Depositing credits to wallet');
            console.log(err);
            this.setState({
                ...this.state, 
                toaster: {open: true, message: 'Unexpected error occured. Please try after sometime'}
            },()=> this.closeModal())
        }
    }

    // Event Handlers
    openModal = ()=> this.setState({
        ...this.state, 
        modal: {open: true, credits: 0},
        mock_data: {card_number: '',cvv: '', service: ''},
    });
    closeModal = ()=> this.setState({
        ...this.state, 
        modal: {open: false, credits: 0},
        mock_data: {card_number: '',cvv: '', service: ''},
    });
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
                    open={this.state?.modal?.open} 
                    onClose={this.closeModal} 
                    PaperProps = {{
                        sx:{
                            borderRadius: '28px', 
                            width: '640px', 
                            height: '540px',
                            overflow: 'scroll', 
                            '&::-webkit-scrollbar': {display: 'none'}
                        }
                    }}
                >
                    <DialogTitle sx={{borderBottom: '1px solid #CCC', mb: '16px'}}>
                        Top up your wallet
                    </DialogTitle>
                    <DialogContent sx={{overflow: 'scroll','&::-webkit-scrollbar': {display: 'none'}}}>
                        <Box 
                            sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%'
                            }}
                        >
                            <Box>
                                <Typography sx={{fontSize: '16px', fontWeight: 600, color: '#1C1E26'}}>
                                    Card Details
                                </Typography>
                            </Box>
                            <Stack direction = {'row'} spacing = {2} sx={{my: '12px'}}>
                                <Box
                                    sx={{
                                        border: this.state?.mock_data['service'] === 'VISA'? '1px solid #be10d3': '1px solid transparent',
                                        '& : hover': {cursor: 'pointer'}
                                    }}
                                    onClick = { ()=> {
                                        this.setState({
                                            ...this.state, 
                                            mock_data: {
                                                ...this.state?.mock_data, 
                                                service: this.state?.mock_data['service'] === 'VISA'? '': 'VISA'
                                            }
                                        });
                                    } }
                                >
                                    <VisaCardIcon/>
                                </Box>
                                <Box
                                    sx={{
                                        border: this.state?.mock_data['service'] === 'MASTERCARD'? '1px solid #be10d3': '1px solid transparent',
                                        '& : hover': {cursor: 'pointer'}
                                    }}
                                    onClick = { ()=> {
                                        this.setState({
                                            ...this.state, 
                                            mock_data: {
                                                ...this.state?.mock_data, 
                                                service: this.state?.mock_data['service'] === 'MASTERCARD'? '': 'MASTERCARD'
                                            }
                                        });
                                    } }
                                >
                                    <MasterCardIcon/>
                                </Box>
                                <Box
                                    sx={{
                                        border: this.state?.mock_data['service'] === 'MAESTRO'? '1px solid #be10d3': '1px solid transparent',
                                        '& : hover': {cursor: 'pointer'}
                                    }}
                                    onClick = { ()=> {
                                        this.setState({
                                            ...this.state, 
                                            mock_data: {
                                                ...this.state?.mock_data, 
                                                service: this.state?.mock_data['service'] === 'MAESTRO'? '': 'MAESTRO'
                                            }
                                        });
                                    } }
                                >
                                    <MaestroCardIcon/>
                                </Box>
                            </Stack>
                        </Box>
                        <Grid container spacing={2} sx={{mt: '0px'}}>
                            <Grid item xs={12}>
                                <CustomTextField
                                    name = {'name'}
                                    type = {'text'}
                                    label = {'Name On The Card'}
                                    placeholder = {''}
                                    value = {display_name}
                                    disabled = {true}
                                    required = {true}
                                    error = {false}
                                    helperText = {''}
                                    changeHandler = {({field, value})=>{}}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <CustomTextField
                                    name = {'number'}
                                    type = {'text'}
                                    label = {'Card Number'}
                                    placeholder = {'Enter card number'}
                                    value = {this.state?.mock_data['card_number']}
                                    disabled = {false}
                                    required = {true}
                                    error = {false}
                                    helperText = {''}
                                    changeHandler = {({field, value})=> this.setState({...this.state, mock_data: {...this.state?.mock_data, card_number: value}})}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <CustomTextField
                                    name = {'cvv'}
                                    type = {'text'}
                                    label = {'CVV'}
                                    placeholder = {'Enter CVV'}
                                    value = {this.state?.mock_data['cvv']}
                                    disabled = {false}
                                    required = {true}
                                    error = {false}
                                    helperText = {''}
                                    changeHandler = {({field, value})=> this.setState({...this.state, mock_data: {...this.state?.mock_data, cvv: value}})}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextField
                                    name = {'credits'}
                                    type = {'number'}
                                    label = {'Amount'}
                                    placeholder = {'Enter amount to deposit'}
                                    value = {this.state?.modal['credits'].toString()}
                                    disabled = {false}
                                    required = {true}
                                    error = {false}
                                    helperText = {'Remember to enter valid amount'}
                                    changeHandler = {({field, value})=>this.setState({...this.state, modal: {...this.state.modal, credits: parseInt(value)}})}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{py: '16px', px: '32px'}}>
                        <Button 
                            variant="contained" 
                            endIcon={<ThumbUpOffAltIcon />}
                            color={'secondary'}     
                            disabled = {isNaN(parseInt(this.state?.modal['credits']))? true: false}  
                            onClick = {this.updateCredits}
                        >
                            Confirm 
                        </Button>
                    </DialogActions>
                </Dialog>

                <Box sx={{ display: 'block',textAlign: 'left',mb: '16px', width: '100%', position: 'static', mt: '8px'}}>
                    <Typography sx={{fontSize: '24px', fontWeight: 600, color: '#1C1E26'}}>
                        My Wallet
                    </Typography>
                </Box>
                <Divider />
                <Grid container spacing={2} sx={{mt: '0px',}}>
                    <Grid item xs={12} md={8}>
                        <Box sx={{mt:'16px',display: {xs: 'none', md: 'block'}}}>
                            <img 
                                src={payment} 
                                width={'480px'} 
                                height={'360px'} 
                                alt={'payment'}
                            />
                        </Box>
                    </Grid>
                    <Grid 
                        item 
                        xs={12} 
                        md={4}
                        sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    >
                        <Paper 
                            variant={'outlined'}
                            sx={{
                                width: {xs: '50%', md: '100%'},
                                height: 'calc(100vh - 196px)',
                                borderRadius: '28px',
                                padding: '16px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                overflow: 'scroll', 
                                '&::-webkit-scrollbar': {display: 'none'}
                            }}
                        >
                            <Stack spacing={'24px'} sx={{width: '100%'}}>
                                <Paper 
                                    variant={'outlined'}
                                    sx={{
                                        width: '100%',
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
                                <Box 
                                    sx={{
                                        mt: '16px', 
                                        width: '100%',
                                        height: '85px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <Typography sx={{fontSize: '20px', fontWeight: 500, color: '#1C1E26'}}>
                                        Total Balance
                                    </Typography>
                                    <Typography sx={{fontSize: '36px', fontWeight: 900, color: '#040620'}}>
                                        {this.state?.credits}
                                    </Typography>
                                </Box>
                                <Box sx={{width: '100%'}}>
                                    <Button 
                                        variant="contained" 
                                        endIcon={<AddOutlinedIcon />}
                                        color={'secondary'}   
                                        fullWidth
                                        size={'large'}                     
                                        onClick = {this.openModal}
                                    >
                                        Top up
                                    </Button>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
};

export default StudentWalletMount;



