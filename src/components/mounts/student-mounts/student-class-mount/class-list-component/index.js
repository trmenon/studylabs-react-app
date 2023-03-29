import { Class } from "@mui/icons-material";
import React, { Component} from "react";
import { services } from "../../../../../services/api";

// Legacy Imports
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

class ClassListingComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toaster: { open: false, message: ''},
            classList: []
        }
    }

    // Lifecycle Methods
    componentDidMount() {this.fetchAllClasses()}
    componentDidUpdate() {
        console.log('[UPDATE] Class listing component with state');
        console.log(this.state);
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

    // Event Handlers
    closeSnackbar = ()=> this.setState({...this.state, toaster: {open: false, message: ''}});

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
                <Grid container spacing={2}>
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
                                                height: '100px', 
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
                                        <CardActions sx={{borderTop: '1px solid e5e5e5'}}>
                                            <Button 
                                                size="small"
                                            >
                                                Enroll
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </React.Fragment>
        )
    }
};

export default ClassListingComponent;