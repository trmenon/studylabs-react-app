import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { v4 } from 'uuid';
import { services } from '../../../../services/api';

// Legacy Imports
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';

// HOC
import ArchiveListComponent from './archive-list-component';

const StudentSessionMount = ()=> {
    // GLOBALS
    const params = useParams();
    // State
    const [state, setState] = useState({
        classTitle: '',
        classDescription: '',
        subjectTitle: '',
        subjectDescription: '',
        archiveList: [],
        toaster: {open: false, message: ''},
        render: ''
    })

    // Effects
    useEffect(()=> {fetchClassDetails()}, []);
    // useEffect(()=> {console.log(state)}, [state]);

    // API
    const fetchClassDetails = ()=> {
        try{
            services
            .classServices
            .fetchClassById(params?.id)
            .subscribe({
                next: (response)=> {
                    if(response && response?.success === true && response?.data){
                        setState({
                            ...state,
                            classTitle: response?.data['classTitle'] || '',
                            classDescription: response?.data['classDescription'] || '',
                            subjectTitle: response?.data?.subject['subjectTitle'] || '',
                            subjectDescription: response?.data?.subject['subjectDescription'] || '',
                            archiveList: response?.data['archives'] || [],
                            render: v4()
                        })
                    }else {
                        setState({
                            ...state,
                            toaster: {
                                open: false,
                                message: response?.message ||  'Server busy. Please try after sometime'
                            }
                        })  
                    }
                },
                error: (error)=> {
                    console.log('[ERROR] Fetching class information');
                    console.log(error);
                    setState({
                        ...state,
                        toaster: {
                            open: false,
                            message: 'Server busy. Please try after sometime'
                        }
                    })
                },
            })
        }catch(err) {
            console.log('[ERROR: API] Fetching class information');
            console.log(err);
            setState({
                ...state,
                toaster: {
                    open: false,
                    message: 'Unexpected error occured. Please try after sometime'
                }
            })
        }
    }

    // Event Handlers
    const closeSnackbar = ()=> setState({...state,  toaster: {open: false, message: ''}})

    // Renderer
    return(
        <React.Fragment>
            <Snackbar
                open={state?.toaster['open']}
                autoHideDuration={6000}
                onClose={closeSnackbar}
                message= {state?.toaster['message']}
            />
            <Box 
                sx={{ 
                    display: 'block',
                    textAlign: 'left',
                    mb: '16px', 
                    width: '100%', 
                    position: 'static',
                    borderBottom: '1px solid #eaeaea'
                }}
            >
                <Typography sx={{fontSize: '24px', fontWeight: 600, color: '#1C1E26'}}>
                    {state?.classTitle}
                </Typography>
            </Box>

            <Grid container spacing={2} sx={{width: '100%'}}>
                <Grid item xs={12} sm={12} lg={4}>
                    <Card 
                        raised={true} 
                        sx={{ 
                            minWidth: 275,
                            height: 'calc(100vh - 196px)', 
                            borderRadius: '28px',
                            overflow: 'scroll', 
                            '&::-webkit-scrollbar': {display: 'none'}
                        }}
                    >
                        <CardContent>
                            <Typography sx={{fontSize: '20px', fontWeight: 600, color: '#1C1E26', textAlign: 'left'}}>
                                About the program
                            </Typography>
                            <Divider/>
                            <Typography 
                                sx={{fontSize: '14px', fontWeight: 500, color: '#3f424e', textAlign: 'left'}}
                            >
                                {state?.classDescription}
                            </Typography>
                            <Box sx={{width: '100%', my: '24px', px: '16px'}}>
                                <Paper
                                    variant={'outlined'}
                                    sx={{
                                        width: '100%',
                                        borderRadius: '28px',
                                        padding: '12px'
                                    }}
                                >
                                    <Typography sx={{fontSize: '20px', fontWeight: 600, color: '#1C1E26', textAlign: 'left'}}>
                                        {state?.subjectTitle}
                                    </Typography>
                                    <Divider/>
                                    <Typography 
                                        sx={{fontSize: '14px', fontWeight: 500, color: '#3f424e', textAlign: 'left'}}
                                    >
                                        {state?.subjectDescription}
                                    </Typography>
                                </Paper>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid 
                    item 
                    xs={12} 
                    sm={12}
                    lg={8}
                    sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}
                >
                    <ArchiveListComponent key={state?.render} archiveList={state?.archiveList}/>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default StudentSessionMount;