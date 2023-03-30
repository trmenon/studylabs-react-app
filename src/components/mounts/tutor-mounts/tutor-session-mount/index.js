import React, { useState, useEffect} from 'react';
import moment from "moment/moment";
import { services } from '../../../../services/api';
import { useParams } from 'react-router-dom';
import { v4 } from 'uuid';

// Legacy Imports
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { deepOrange, deepPurple } from '@mui/material/colors';

// Child components
import CreateNoteMount from './create-note';

const ClassSessionMount = (props)=> {
    // Globals
    const params = useParams();
    // State
    const [state, setState] = useState({
        data: {
            classTitle: '',
            classDescription: '',
            subject: { subjectTitle: '', subjectDescription: '', subjectKey: ''},
            enrolled: [],
            archives: [],
            isActive: false,
        },
    });

    // Effects
    useEffect(()=> {
        fetchClassDetailsById();
    }, []);
    useEffect(()=> {console.log(state)}, [state])

    // APIs
    const fetchClassDetailsById = ()=> {
        try{
            services
            .classServices
            .fetchClassById(params?.id)
            .subscribe({
                next: (response)=> {
                    if(response && response?.success === true) {
                        setState({
                            ...state,
                            data: {
                                classTitle: response?.data?.classTitle ||  '',
                                classDescription: response?.data?.classDescription ||  '',
                                subject: { 
                                    subjectTitle: response?.data?.subject?.subjectTitle ||  '', 
                                    subjectDescription: response?.data?.subject?.subjectDescription ||  '',
                                    subjectKey: response?.data?.subject?._id ||  ''
                                },
                                enrolled: response?.data?.enrolled ||  [],
                                archives: response?.data?.archives ||  [],
                                isActive: response?.data?.isActive,
                            }
                        })
                    }
                },
                error: (error)=> {
                    console.log('[ERROR] Unable to get class information');
                    console.log(error)  
                },
            })
        }catch(err) {
            console.log('[ERROR] Unable to get class information');
            console.log(err)
        }
    }
    const updateClassDetails = (noteId)=> {
        try{
            services
            .classServices
            .updateNotesToClassArchive(
                params?.id,
                noteId
            ).subscribe({
                next: (response)=> {
                    if(
                        response &&
                        response?.success === true
                    ) {
                        fetchClassDetailsById();
                    }
                },
                error: (error)=> {
                    console.log('[ERROR] Unable to update class information notes archives');
                    console.log(error)
                },
            })
        }catch(err) {
            console.log('[ERROR] Unable to update class information notes archives');
            console.log(err)
        }
    }

    // Event Handlers
    const updateNoteToClassList = (note_id)=> updateClassDetails(note_id);
    
    

    // Renderer
    return(
        <React.Fragment>
            <Box sx={{
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    pt: '0px', 
                    pb: '12px',
                    borderBottom: '1px solid #CCC',
                    mb: '24px'
                }}
            >
                <Box>
                    <Typography
                        variant={'body1'}
                        sx={{color: '#171D41', fontWeight: 700, fontSize: '28px'}}
                    >
                        {state?.data?.classTitle}
                    </Typography>
                </Box>
                <Box>
                    <CreateNoteMount 
                        key={v4()}
                        subject={state?.data?.subject?.subjectKey}
                        refresh = {updateNoteToClassList}
                    />
                </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                       <Stack spacing={'16px'} sx={{width: '100%', px: '16px'}}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', pl: '16px'}}>
                                <Typography sx={{color: '#1c1e26', fontWeight: 600, fontSize: '16px'}}>
                                   Archives
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                                <Paper 
                                    variant={'outlined'}
                                    sx={{
                                        height: '392px',
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
                                    <List sx={{width: '100%'}}>
                                        {
                                            state?.data['archives'].map((item)=> {
                                                return(
                                                    <ListItem key={v4()} disablePadding>
                                                        <ListItemButton>
                                                            <ListItemIcon>
                                                                <TextSnippetOutlinedIcon />
                                                            </ListItemIcon>
                                                            <ListItemText 
                                                                primary={item?.notesTitle} 
                                                                secondary = {moment(item?.createdAt).format('lll')}
                                                            />
                                                        </ListItemButton>
                                                    </ListItem>
                                                )
                                            })
                                        }
                                    </List>
                                </Paper>
                            </Box>
                       </Stack>
                    </Grid>
                    <Grid item xs={0} md={4} sx={{display: {xs: 'none', md: 'block'}}}>
                        <Box sx={{width: '100%', mb: '16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', pl: '16px'}}>
                            <Typography sx={{color: '#1c1e26', fontWeight: 600, fontSize: '16px'}}>
                                Enrolled students
                            </Typography>
                        </Box>
                        <Paper 
                            variant={'outlined'}
                            sx={{
                                height: '392px',
                                borderRadius: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',   
                                flexDirection: 'column',
                                overflow: 'scroll',
                                '&::-webkit-scrollbar': {display: 'none'}                                     
                            }}
                        >
                            <Box sx={{width: '100%', py: '16px', borderBottom: '1px solid #eaeaea'}}>
                                <Typography sx={{color: '#1c1e26', fontWeight: 600, fontSize: '12px'}}>
                                    Enrollment Directory
                                </Typography>
                            </Box>
                            {
                                state?.data?.enrolled.length === 0?
                                <Box sx={{width: '100%'}}>
                                    <Alert variant="outlined" severity="info" sx={{width: '100%'}}>
                                        No students have enrolled
                                    </Alert>
                                </Box>
                                :
                                <List sx={{ width: '100%'}}>
                                    {
                                        state?.data?.enrolled.map((element)=> {
                                            return (
                                                <ListItem 
                                                    key={element?._id} 
                                                    sx={{borderBottom: '1px solid #eaeaea'}}
                                                >
                                                    <Chip 
                                                        avatar={
                                                            <Avatar sx={{ bgcolor: deepPurple[500] }}>
                                                                {`${element?.firstName[0]}${element?.lastName[0]}`}
                                                            </Avatar>
                                                        } 
                                                        label={`${element?.firstName} ${element?.lastName}`} 
                                                        variant={'outlined'}
                                                        color={'secondary'}
                                                    />
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>

                            }
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    )
}

export default ClassSessionMount;