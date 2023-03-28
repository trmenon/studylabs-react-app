import React, { useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';

// Assets
import logo from '../../../assets/logo.png';

// services 
import { services } from '../../../services/api';

// Legacy Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';

// Children Components
import { LoginComponent, RegisterComponent } from './components';

// Utilities
import { authenticateUser } from '../../../authentication';
import { getLocalStorageByKey } from '../../../authentication/utils';

// Design Constants
import { designs } from './designs';


const GateComponent = ()=> {
    // Globals
    const navigate = useNavigate();
    const loginFormRef = useRef();
    const registerFormRef = useRef();
    // States
    const [state, setState] = useState({isLogin: true, toaster: {open: false, message: ''}});

    // Event Handlers 
    const buttonClickDriver = ()=> {
        try{
            if(state?.isLogin === true) {
                handleLogin();
            }else {
                handleRegister();
            }
        }catch(err) {
            console.log('[ERROR] Button click driver');
            console.log(err);
        }
    }
    const handleRegister = ()=> {
        const {validation, data} = registerFormRef.current.formSubmit();
        try{
            if(validation === true) {
                services
                .userServices
                .createStudentAccount(data)
                .subscribe({
                    next: (response)=> {
                        if(response && response?.success === true) {
                            setState({
                                ...state, 
                                isLogin: true,
                                toaster: {open: true, message: 'Welcome to StudyLabs. Now lets login to get you initiated with the program.'}
                            });
                        }
                    },
                    error: (error)=> {
                        console.log(error);
                        setState({
                            ...state,
                            toaster: {open: true, message: 'Unable to sign you up. Do give it one more try.'}
                        })
                    },
                })
            }            
        }catch(err) {
            console.log('[ERROR] Creating a new account for student');
            console.log(err);
            setState({
                ...state,
                toaster: {open: true, message: 'Unable to sign you up. Do give it one more try.'}
            })
        }
    }

    const handleLogin = ()=> {
        try{
            const {validation, data} = loginFormRef.current.formSubmit();
            if(validation === true) {
                services
                .userServices
                .signin(data)
                .subscribe({
                    next: (response)=> {
                        if(response) {
                            if(response?.success === true) {
                                console.log(response);
                                const authData = { 
                                    token : response?.token, 
                                    user : response?.data 
                                };
                                const auth = authenticateUser(authData);
                                if(auth === true) {
                                    const sessionData = getLocalStorageByKey('user');
                                    console.log(sessionData);
                                    if(
                                        sessionData &&
                                        sessionData?.admin === true &&
                                        sessionData?.student === false &&
                                        sessionData?.tutor === false
                                    ) {
                                        navigate('/admin/home');
                                    }
                                    if(
                                        sessionData &&
                                        sessionData?.admin === false &&
                                        sessionData?.student === true &&
                                        sessionData?.tutor === false
                                    ) {
                                        navigate('/student/home');
                                    }
                                    if(
                                        sessionData &&
                                        sessionData?.admin === false &&
                                        sessionData?.student === false &&
                                        sessionData?.tutor === true
                                    ) {
                                        navigate('/tutor/home');
                                    }
                                }
                            }
                            if(response?.success === false) {
                                setState({
                                    ...state,
                                    toaster: {open: true, message: response?.message || 'Invalid credentials. Please check and try again'}
                                })
                            }
                        }
                    },
                    error: (error)=> {
                        console.log('[ERROR] Trying to login');
                        console.log(error);
                        setState({
                            ...state,
                            toaster: {open: true, message: 'Unexpected error occured. Please try again'}
                        })
                    },
                })
            }
        }catch(err) {
            console.log('[ERROR] Trying to login');
            console.log(err);
            setState({
                ...state,
                toaster: {open: true, message: 'Unexpected error occured. Please try again'}
            })
        }
    }

    // Renderer
    return(
        <React.Fragment>
            <Snackbar
                open={state?.toaster['open']}
                autoHideDuration={6000}
                onClose={()=> setState({...state, toaster: {open: false,  message: ''}})}
                message= {state?.toaster['message']}
            />
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <img 
                            width = {'40px'}
                            height = {'40px'}
                            src={logo}
                            alt={'StudyLabs'}
                        />
                        <Stack sx={{display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                            <Typography variant="h4">
                                StudyLabs
                            </Typography>
                            <Typography 
                                variant="subtitle" 
                                gutterBottom
                                sx={{color: '#003687', fontWeight: '400', fontStyle: 'italic'}}
                            >
                                Experience interactive learning through agile classrooms
                            </Typography>
                        </Stack>
                        
                    </Toolbar>
                </AppBar>
            </Box>

            <Box sx={designs?.background_designs}>
                <Card 
                    raised={true} 
                    sx={{ 
                        width: {xs:'90%', sm: '80%', md: '60%', lg: '50%'}, 
                        height: '490px',
                        mt: '24px',
                        borderRadius: '24px',
                        pb: '4px',
                        overflow: 'scroll',
                        '&::-webkit-scrollbar': {display: 'none'}
                    }}
                >
                    
                    <CardContent sx={{px: '16px'}}>
                        <Stack 
                            spacing={'4px'}
                            sx={{
                                borderBottom: '1px solid #edebeb',
                                marginBottom: '16px',
                                pb: '8px'
                            }}
                        >
                            <Box sx={{display: 'flex', justifyContent: 'flex-start'}}>
                                <Typography 
                                    variant="h4"
                                    sx={{color: '#35b334', fontWeight: '600'}}
                                >
                                    {state?.isLogin === true? "Welcome back" : "Create your free account"}
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'flex-start'}}>
                                <Typography 
                                    variant="subtitle2"
                                    sx={{color: '#4e584e', fontWeight: '400', fontStyle: 'oblique'}}
                                >
                                    {state?.isLogin === true? "Lets learn. Login to your StudyLab account to access your courses" : "Have your own customized learning platform"}
                                </Typography>
                            </Box>
                        </Stack>
                        {
                            state?.isLogin === true? 
                                <LoginComponent ref={loginFormRef}/> 
                                : 
                                <RegisterComponent ref={registerFormRef}/>
                        }
                    </CardContent>
                    <CardActions sx={{px: '16px'}}>
                        <Box 
                            sx={{
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'flex-end',
                                width: '100%'
                            }}
                        >
                            <Button 
                                onClick={()=> setState({...state, isLogin: state.isLogin === false})}
                                variant={'text'}
                                color={state?.isLogin === true? 'primary': 'secondary'}
                            >
                                {state?.isLogin === true? 'Register for free': 'I already have an account'}
                            </Button>
                            <Button 
                                onClick={buttonClickDriver}
                                variant={'outlined'}
                                color={'primary'}
                            >
                                {state?.isLogin === true? 'Sign in': 'Sign up'}
                            </Button>
                        </Box>
                        
                    </CardActions>
                </Card>
            </Box>
        </React.Fragment>
    )
}

export default GateComponent;