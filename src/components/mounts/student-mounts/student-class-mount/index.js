import React, { useState, useEffect} from "react";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { services } from "../../../../services/api";
import { getLocalStorageByKey } from "../../../../authentication/utils";
import moment from "moment/moment";

// legacy Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';

// HOC
import ClassListingComponent from "./class-list-component";

// Constants
const USER_ID = getLocalStorageByKey('user')?._id;

const StudentClassMount = ()=> {
    // GLOBALS
    const navigate = useNavigate();

    // State
    const [ state, setState] = useState({
        enrollList: [],
        render: '',
        openModal: false
    });

    // Effects
    useEffect(()=> {fetchAllEnrollmentsForUser()}, []);
    // useEffect(()=> {console.log(state)}, [state])

    // API Calls
    const fetchAllEnrollmentsForUser = ()=> {
        try{
            services
            .enrollmentServices
            .fetchAllEnrollmentByUser(USER_ID)
            .subscribe({
                next: (response)=> {
                    if(
                        response &&
                        response?.success === true &&
                        response?.data &&
                        response?.data?.classes &&
                        Array.isArray(response?.data.classes)
                    ) {
                        setState({
                            ...state,
                            enrollList: response?.data.classes,
                            render: v4()
                        })
                    }
                },
                error: (error)=> {
                    console.log('[ERROR: API] Fetching all enrollments');
                    console.log(error)
                },
            })
        }catch(err) {
            console.log('[ERROR: API] Fetching all enrollments');
            console.log(err)
        }
    }

    // Event Handlers
    const handleNavigate = (key)=> navigate(key)

    // Renderer
    return (
        <React.Fragment>
            
            <Box
                sx={{
                    width: '100%',
                    mt: '0px',
                    pb: '4px',
                    borderBottom: '1px solid #CCCCCC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}
            >
                <Typography
                    variant={'body1'}
                    sx={{color: '#171D41', fontWeight: 700, fontSize: '28px'}}
                >
                    Class Directory
                </Typography>
            </Box>
            <Grid container spacing={2} sx={{width: '100%', mt: '12px'}}>
                <Grid item xs={12} md={8} sx={{mt: '36px'}}>
                    <ClassListingComponent
                        key = {state?.render}
                        user = {USER_ID}
                        enrollments = {state?.enrollList.map((item)=> {return item?._id})}
                        refresh = {fetchAllEnrollmentsForUser}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper 
                        variant={'outlined'}
                        sx={{
                            height: '412px',
                            width: '100%',
                            borderRadius: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',   
                            flexDirection: 'column',
                            overflow: 'scroll',
                            '&::-webkit-scrollbar': {display: 'none'}                                     
                        }}
                    >
                        <Box 
                            sx={{
                                width: '100%', 
                                borderBottom: '1px solid #CCC',
                                py: '8px',
                                px: '12px',
                                display: 'flex',
                                justifyContent: 'flex-start'
                            }}
                        >
                            <Typography
                                variant={'body1'}
                                sx={{color: '#171D41', fontWeight: 700, fontSize: '14px'}}
                            >
                                My Classes
                            </Typography>
                        </Box>
                        <Box sx={{width: '100%'}}>
                            {
                                state?.enrollList.length === 0?
                                    <Alert variant="outlined" severity="info" sx={{width: '100%'}}>
                                        No enrollments yet
                                    </Alert>
                                    :
                                    <List sx={{ width: '100%'}}>
                                        {
                                            state?.enrollList.map((element)=> {
                                                return(
                                                    <ListItem 
                                                        key={element?._id} 
                                                        sx={{
                                                            borderBottom: '1px solid #eaeaea',
                                                            '&:hover': {cursor: 'pointer'}
                                                        }}
                                                        onClick = {()=> handleNavigate(element?._id)}
                                                    >
                                                        <ListItemText 
                                                            primary={element?.classTitle} 
                                                            secondary={moment(element?.updatedAt).format('lll')}
                                                        />
                                                    </ListItem>
                                                )
                                                
                                            })
                                        }
                                    </List>
                            }
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

        </React.Fragment>
    )
};

export default StudentClassMount;