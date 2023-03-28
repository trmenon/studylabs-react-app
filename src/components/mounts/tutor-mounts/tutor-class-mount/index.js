import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

// Services Imports
import { services } from "../../../../services/api";

// Uttilities
import { getLocalStorageByKey } from "../../../../authentication/utils";

// Legacy Imports
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const TutorClassesMount = ()=> {
    // GLOBALS
    const navigate = useNavigate();
    // States
    const [state, setState] = useState({
        classList: [],
        toaster: {open: false, message: ''},
    })

    // Effects
    useEffect(()=> {fetchAllClassesByTutorService()},[])
    useEffect(()=> {console.log(state)},[state])

    // APIs
    const fetchAllClassesByTutorService = ()=> {
        const tutorId = getLocalStorageByKey('user')?._id;

        try{
            services
            .classServices
            .fetchClassByTutor(tutorId)
            .subscribe({
                next: (response)=> {
                    if(
                        response && 
                        response?.success === true &&
                        response?.data &&
                        Array.isArray(response?.data)
                    ){
                        setState({...state, classList: response?.data})
                    }else {
                        setState({
                            ...state, 
                            toaster: {
                                open: true, 
                                message: response?.message || 'Unable to process request. Please try after sometime'}
                        })
                    }
                },
                error: (error)=> {
                    console.log('[ERROR] Fetching all classes by tutor-id');
                    console.log(error);
                    setState({...state, toaster: {open: true, message: 'Server busy. Please try after sometime'}})
                },
            })
        }catch(err) {
            console.log('[ERROR] Fetching all classes by tutor-id');
            console.log(err);
            setState({...state, toaster: {open: true, message: 'Unexpected error occured. Please try after sometime'}})
        }
    }

    // Event Handlers
    const closeSnackbar = ()=> setState({...state, toaster: {open: false, message: ''}});
    const handleNavigate = (key)=> navigate(key);
    
    // Renderer
    return(
        <React.Fragment>
            <Snackbar
                open={state?.toaster['open']}
                autoHideDuration={6000}
                onClose={closeSnackbar}
                message= {state?.toaster['message']}
            />
            <Box sx={{
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'flex-start', 
                    pt: '24px', 
                    pb: '12px',
                    mb: '24px',
                    borderBottom: '1px solid #CCC'
                }}
            >
                <Typography
                    variant={'body1'}
                    sx={{color: '#171D41', fontWeight: 700, fontSize: '28px'}}
                >
                    My Classes
                </Typography>
            </Box>
            <Grid container spacing={2}>
                {
                    state?.classList.map((element)=> {
                        return(
                            <Grid 
                                key={element?._id} 
                                item 
                                xs={12} 
                                xl={2}
                            >
                                <Box
                                    sx={{'& :hover': {cursor: 'pointer',backgroundColor: '#F6F6F5'}}}
                                    onClick = {()=> handleNavigate(element?._id)}
                                >
                                <Paper 
                                    variant={'outlined'}
                                    sx={{
                                        height: '168px',
                                        borderRadius: '28px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',   
                                        flexDirection: 'column'                                     
                                    }}
                                >
                                    <Typography sx={{fontWeight: 600, fontSize: '20px', color: '#1c1e26'}}>
                                        {element?.classTitle}
                                    </Typography>
                                    <Typography sx={{fontWeight: 500, fontSize: '16px', color: '#383940'}}>
                                        {`${element?.enrolled.length} students enrolled`}
                                    </Typography>
                                    <Typography sx={{fontWeight: 500, fontSize: '16px', color: '#383940'}}>
                                        {`${element?.archives.length} archives uploaded`}
                                    </Typography>
                                </Paper>
                                </Box>
                            </Grid>
                        )
                    })
                }
                
            </Grid>
        </React.Fragment>
    )
}

export default TutorClassesMount;