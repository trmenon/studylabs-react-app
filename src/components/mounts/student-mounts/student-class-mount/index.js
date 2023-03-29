import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { services } from "../../../../services/api";
import { getLocalStorageByKey } from "../../../../authentication/utils";

// legacy Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

// HOC
import ClassListingComponent from "./class-list-component";

// Constants
const USER_ID = getLocalStorageByKey('user')?._id;

const StudentClassMount = ()=> {
    // GLOBALS
    const navigate = useNavigate();

    // State
    const [ state, setState] = useState({});

    // Effects

    // API Calls

    // Event Handlers

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
                        user = {USER_ID}
                        refresh = {()=> {}}
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
                                sx={{color: '#171D41', fontWeight: 500, fontSize: '14px'}}
                            >
                                My Classes
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

        </React.Fragment>
    )
};

export default StudentClassMount;