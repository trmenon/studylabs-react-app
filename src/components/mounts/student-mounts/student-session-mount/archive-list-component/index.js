import React, { Component} from "react";
import { services } from "../../../../../services/api";

//  Legacy Imports
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import Snackbar from '@mui/material/Snackbar';


class ArchiveListComponent extends Component {
    constructor(props) {
        super(props);
        this.state= {
            dataList: this.props?.archiveList || [],
            toaster: { open: false, message: ''},
        }
    }

    // Lifecycle Methods
    // componentDidMount(){console.log(this.state)}

    // APIs
    fetchFile = (file)=> {
        try{
            services
            .assetServices
            .downloadFile(file)
            .subscribe({
                next: (response)=>{
                    const media = URL.createObjectURL(response);
                    window.location.assign(media);
                    this.setState({
                        ...this.state,
                        toaster: { 
                            open: true, 
                            message: 'Downloading file'
                        },
                    })
                },
                error: (error)=>{
                    console.log('[ERROR: API] Downloading file');
                    console.log(error);
                    this.setState({
                        ...this.state,
                        toaster: { 
                            open: true, 
                            message: 'Server busy. Please try after sometime.'
                        },
                    })
                },
            })
        }catch(err){
            console.log('[ERROR: API] Downloading file');
            console.log(err);
            this.setState({
                ...this.state,
                toaster: { 
                    open: true, 
                    message: 'Unexpected error occured. Please try after sometime.'
                },
            })
        }
    }

    // Event Handlers
    closeSnackbar = ()=> this.setState({...this.state, toaster: { open: false, message: ''},})

    // Renderer
    render() {
        return (
            <React.Fragment>
                <Snackbar
                    open={this.state?.toaster['open']}
                    autoHideDuration={6000}
                    onClose={this.closeSnackbar}
                    message= {this.state?.toaster['message']}
                />
                <Paper 
                    variant={'outlined'}
                    sx={{
                        width: '100%',
                        height: 'calc(100vh - 196px)',
                        borderRadius: '28px',
                        overflow: 'scroll', 
                        '&::-webkit-scrollbar': {display: 'none'}
                    }}
                >
                    <Box 
                        sx={{ 
                            display: 'block',
                            textAlign: 'left',
                            p: '24px', 
                            width: '100%', 
                            position: 'static',
                            borderBottom: '1px solid #eaeaea'
                        }}
                    >
                        <Typography sx={{fontSize: '20px', fontWeight: 600, color: '#1C1E26'}}>
                            Note Archives
                        </Typography>
                    </Box>
                    <List sx={{ width: '100%'}}>
                        {
                            this.state?.dataList.map((element)=> {
                                return (
                                    <ListItem 
                                        key={element?._id} 
                                        sx={{borderBottom: '1px solid #eaeaea'}}
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                <PictureAsPdfOutlinedIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={element?.notesTitle} 
                                            secondary={element?.notesDescription}
                                        />
                                        <IconButton onClick = {()=> this.fetchFile(element?.accessUrl)}>
                                            <CloudDownloadOutlinedIcon />
                                        </IconButton>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </Paper>
            </React.Fragment>
        )
    }
}

export default ArchiveListComponent;