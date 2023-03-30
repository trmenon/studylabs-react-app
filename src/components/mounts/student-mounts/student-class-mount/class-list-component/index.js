import React, { Component} from "react";
import { services } from "../../../../../services/api";
import { getLocalStorageByKey } from "../../../../../authentication/utils";

// Legacy Imports
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PaymentsIcon from '@mui/icons-material/Payments';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';

class ClassListingComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toaster: { open: false, message: ''},
            classList: [],
            enrollments: this.props?.enrollments,
            openModal: false,
        }
    }

    // Lifecycle Methods
    componentDidMount() {this.fetchAllClasses()}
    componentDidUpdate() {
        // console.log('[UPDATE] Class listing component with state');
        // console.log(this.state);
    }

    // APIs
    fetchAllClasses = ()=> {
        try{
            services
            .classServices
            .fetchAllClasses()
            .subscribe({
                next: (response)=> {
                    if(
                        response &&
                        response?.success === true &&
                        response?.data &&
                        response?.data?.data &&
                        Array.isArray(response?.data?.data)
                    ) {
                        this.setState({...this.state, classList: response?.data?.data})
                    }else {
                        this.setState({
                            ...this.state,
                            toaster: {open: true, message: 'Unable to process at the moment. Please try after sometime'}
                        })
                    }
                },
                error: (error)=> {
                    console.log('[ERROR: API] Fetching all classes as list');
                    console.log(error);
                    this.setState({
                        ...this.state,
                        toaster: {open: true, message: 'Server busy. Please try after sometime'}
                    })
                },
            })
        }catch(err) {
            console.log('[ERROR: API] Fetching all classes as list');
            console.log(err);
            this.setState({
                ...this.state,
                toaster: {open: true, message: 'Unexpected error occured. Please try after sometime'}
            })
        }
    }
    enrollClassById = (key)=> {
        const payload = {
            userId: getLocalStorageByKey('user')?._id,
            classId: key
        };
        try{
            services
            .classServices
            .updateClassEnrollment(payload)
            .subscribe({
                next: (response)=> {
                    if(response?.success === true) {
                        this.setState({
                            ...this.state,
                            openModal: false,
                            toaster: { 
                                open: true, 
                                message: response?.message ||  'You have enrolled for a new class. Happy learning'
                            },
                        }, ()=> this.props?.refresh())
                    }else {
                        this.setState({
                            ...this.state,
                            openModal: false,
                            toaster: { 
                                open: true, 
                                message: response?.message || 'Unable to process your request at the moment. Please try after sometime.'
                            },
                        })
                    }
                },
                error: (error)=> {
                    console.log('[ERROR] Enrollment');
                    console.log(error);
                    this.setState({
                        ...this.state,
                        openModal: false,
                        toaster: { 
                            open: true, 
                            message: 'Server busy at the moment. Please try after sometime.'
                        },
                    })
                },
            })
        }catch(err) {
            console.log('[ERROR] Enrollment');
            console.log(err);
            this.setState({
                ...this.state,
                openModal: false,
                toaster: { 
                    open: true, 
                    message: 'Unexpected error occured. Please try after sometime.'
                },
            })
        }
    }

    // Event Handlers
    closeSnackbar = ()=> this.setState({...this.state, toaster: {open: false, message: ''}});
    handleEnrollment = (key)=> {
        this.setState({
            ...this.state,
            openModal: true
        }, ()=> this.enrollClassById(key))
    }

    // Renderer
    render() {
        return(
            <React.Fragment>
                <Snackbar
                    open={this.state?.toaster['open']}
                    autoHideDuration={6000}
                    onClose={this.closeSnackbar}
                    message= {this.state?.toaster['message']}
                />
                <Dialog 
                    open={this.state?.openModal} 
                    onClose={()=> {}} 
                    sx={{'& .MuiDialog-paper': {borderRadius: '24px',py: '16px'},}}
                >
                    <DialogContent>
                        <Stack spacing={'32px'}>
                            <Typography
                                variant={'body1'}
                                sx={{color: '#171D41', fontWeight: 700, fontSize: '32px'}}
                            >
                                Please wait while we enroll you into the program
                            </Typography>
                            <Box sx={{ width: '100%' }}>
                                <LinearProgress />
                            </Box>
                        </Stack>
                    </DialogContent>
                </Dialog>
                {
                    this.state?.classList.length === 0?
                        <Box sx={{width: '100%'}}>
                            <Alert variant="outlined" severity="info" sx={{width: '100%'}}>
                                There are no classes to show at the moment
                            </Alert>
                        </Box>
                        :
                        <List sx={{ width: '100%'}}>
                            {
                                this.state?.classList.map((element)=> {
                                    return(
                                        <ListItem 
                                            key={element?._id} 
                                            sx={{borderBottom: '1px solid #eaeaea'}}
                                        >
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <CastForEducationIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText 
                                                primary={element?.classTitle} 
                                                secondary={`${element?.handledBy?.firstName} ${element?.handledBy?.lastName}`}
                                            />
                                            <Stack 
                                                spacing={0} 
                                                direction={'row'} 
                                                sx={{px: '8px', display: 'flex', alignItems: 'center'}}
                                            >
                                                <PaymentsIcon/>
                                                <Typography 
                                                    sx={{ fontSize: 12, color: '#0d2a29', fontWeight: 700 }} 
                                                    gutterBottom
                                                >
                                                    {'10'}
                                                </Typography>
                                            </Stack>
                                            <Button 
                                                size="small"
                                                disabled = {this.state?.enrollments.includes(element?._id)}
                                                onClick = {()=> this.handleEnrollment(element?._id)}
                                            >
                                                Enroll
                                            </Button>
                                        </ListItem>
                                    )
                                })
                            }
                        </List>
                }
                

                {/* <Grid 
                    container 
                    spacing={2}
                    sx={{
                        display: 'flex',
                        alignItems: 'center', 
                        justifyContent: {xs: 'center', md: 'flex-start'},
                    }}
                >
                    {
                        this.state?.classList.map((element)=> {
                            return (
                                <Grid key={element?._id} item xs={12} md={6}>
                                    <Card 
                                        sx={{ 
                                            width: '100%', 
                                            borderRadius: '28px',
                                             
                                        }}
                                    >
                                        <CardContent 
                                            sx={{
                                                height: '180px', 
                                                overflow: 'scroll', 
                                                '&::-webkit-scrollbar': {display: 'none'}
                                            }}
                                        >
                                            <Box 
                                                sx={{
                                                    width: '100%',
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'flex-start', 
                                                }}
                                            >
                                                <Typography 
                                                    sx={{ fontSize: 18, color: '#007FFF', fontWeight: 500 }} 
                                                    gutterBottom
                                                >
                                                    {element?.classTitle}
                                                </Typography>
                                            </Box>
                                            <Box 
                                                sx={{
                                                    width: '100%',
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'flex-start', 
                                                    textAlign: 'left'
                                                }}
                                            >
                                                <Typography 
                                                    sx={{ fontSize: 12, color: '#1A2027', fontWeight: 300 }} 
                                                    gutterBottom
                                                >
                                                    {element?.classDescription}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                        <CardActions sx={{borderTop: '1px solid e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                            <Button 
                                                size="small"
                                            >
                                                Enroll
                                            </Button>
                                            <Stack direction = {'row'} spacing = {0} sx={{display: 'flex', alignItems: 'center'}}>
                                                <Box><PaymentsIcon/></Box>
                                                <Box>
                                                    <Typography 
                                                        sx={{ fontSize: 20, color: '#0d2a29', fontWeight: 700 }} 
                                                        gutterBottom
                                                    >
                                                        {'10'}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            )
                        })
                    }
                </Grid> */}
            </React.Fragment>
        )
    }
};

export default ClassListingComponent;