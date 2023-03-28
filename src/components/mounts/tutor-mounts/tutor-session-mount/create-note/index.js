import React, { Component} from "react";
import { services } from "../../../../../services/api";
import { populators } from "../../../../../services/api/populatorApi";
import { getLocalStorageByKey } from "../../../../../authentication/utils";

// Legacy Imports
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import IconButton from '@mui/material/IconButton';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import Snackbar from '@mui/material/Snackbar';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';

// HOC imports
import { CustomSelect, CustomTextArea, CustomTextField } from "../../../../common";

class CreateNoteMount extends Component {
    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();
        this.state = {
            fields: {
                notesTitle: {error: false, errorText: '', value: ''},
                notesDescription: {error: false, errorText: '', value: ''},
                subject: {error: false, errorText: '', value: this.props?.subject },
            },
            upload: {status: false, url: ''},
            file: null,
            open: false,
            toaster: {open: false, message: ''}
        }
    }

    // Lifecycles
    componentDidMount(){
        console.log('Mounting child')
        console.log(this.props);
    }
    componentDidUpdate() {
        console.log('[UPDATE] Upload note child component');
        console.log(this.state);
    }

    //  APIs
    uploadFile = ()=> {
        try{
            if(this.state?.file !== null) {
                const formData = new FormData();
                formData.append("file", this.state.file);

                services
                .assetServices
                .uploadFile(formData)
                .subscribe({
                    next: (response)=> {
                        if(response?.success === true && response?.fileName.length > 0) {
                            this.setState({
                                ...this.state,
                                toaster: {open: true, message: 'File has been saved. Now enter details and click to save'},
                                upload: {status: true, url: response?.fileName},
                                file: null,
                            })
                        }else {
                            this.setState({
                                ...this.state,
                                toaster: {open: true, message: 'Unexpected error occured. Please upload after sometime'},
                            })
                        }
                    },
                    error: (error)=> {
                        console.log('[ERROR] Uploading file api error');
                        console.log(error); 
                        this.setState({
                            ...this.state,
                            toaster: {open: true, message: 'Server busy. Please upload after sometime'},
                        })
                    },
                })
            }
        }catch(err) {
            console.log('[ERROR] Uploading file api error');
            console.log(err);
            this.setState({
                ...this.state,
                toaster: {open: true, message: 'Server busy. Please upload after sometime'},
            })
        }
    }
    saveNoteService = ()=> {
        const payload = {
            notesTitle: this.state?.fields['notesTitle']?.value,
            notesDescription: this.state?.fields['notesTitle']?.value,
            subject: this.state?.fields['subject']?.value,
            accessUrl: this.state?.upload['url'],
            createdBy: getLocalStorageByKey('user')?._id
        }

        try{
            services
            .notesServices
            .createNewNote(payload).
            subscribe({
                next: (response)=> {
                    if(response && response?.success === true && response?.data) {
                        this.setState({
                            ...this.state,
                            toaster: {open: true, message:response?.message ||  'New note has been created'}
                        }, ()=> {this.props?.refresh(response?.data?._id)})
                    }else {
                        this.setState({
                            ...this.state,
                            toaster: {open: true, message:response?.message ||  'Unable to create new note at the moment'}
                        })
                    }
                },
                error: (error)=> {
                    console.log('[ERROR] Saving note');
                    console.log(error);
                    this.setState({
                        ...this.state,
                        toaster: {open: true, message: 'Server busy. Please try after sometime'}
                    })
                },
            })
        }catch(err) {
            console.log('[ERROR] Saving note');
            console.log(err);
            this.setState({
                ...this.state,
                toaster: {open: true, message: 'Unexpected error. Please try after sometime'}
            })
        }
    }

    // Event Handlers
    closeSnackbar = ()=> this.setState({...this.state, toaster:{open: false, message: ''}});
    openModal = ()=> this.setState({...this.state, open: true });
    closeModal = ()=> {
        this.setState({
            ...this.state,
            fields: {
                notesTitle: {error: false, errorText: '', value: ''},
                notesDescription: {error: false, errorText: '', value: ''},
                subject: {error: false, errorText: '', value: ''},
            },
            upload: {status: false, url: ''},
            file: null,
            open: false
        })
    } 
    updateFields = ({field, value})=> {
        let current = this.state?.fields;
        current[`${field}`] = {
            ...current[`${field}`],
            value: value
        };
        this.setState({...this.state, fields: current})
    }
    handleFileChange = (event)=> {
        try{
            if(event?.target?.files[0]) {
                this.setState({
                    ...this.state,
                    file: event.target?.files[0]
                })
            }
        }catch(err) {
            console.log('[ERROR] Handling file change');
            console.log(err);
        }
    }
    handleValidateSaveForm = ()=> {
        this.setState({
            ...this.state,
            fields: {
                notesTitle: {
                    ...this.state?.fields['notesTitle'],
                    error: this.state?.fields['notesTitle']?.value.length > 0?  false: true, 
                    errorText: this.state?.fields['notesTitle']?.value.length > 0?  '': 'Title can not be empty', 
                },
                notesDescription: {
                    ...this.state?.fields['notesDescription'],
                    error: this.state?.fields['notesDescription']?.value.length > 0?  false: true, 
                    errorText: this.state?.fields['notesDescription']?.value.length > 0?  '': 'Description can not be empty', 
                },
                subject: {
                    ...this.state?.fields['subject'],
                    error: this.state?.fields['subject']?.value.length > 0?  false: true, 
                    errorText: this.state?.fields['subject']?.value.length > 0?  '': 'A valid subject must be chosen. Please try again', 
                },
            },
        }, ()=> {
            if(
                this.state?.fields['notesTitle']?.error === false &&
                this.state?.fields['notesDescription']?.error === false &&
                this.state?.fields['subject']?.error === false &&
                this.state?.upload['url'].length > 0
            ) {
                this.saveNoteService();
            }
        })
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
                    open={this.state?.open} 
                    onClose={this.closeModal} 
                    fullWidth={true}
                    maxWidth={'md'}
                    sx={{'& .MuiDialog-paper': {borderRadius: '24px',py: '16px'},}}
                >
                    <DialogTitle sx={{borderBottom: '1px solid #CCC', mb: '16px'}}>
                        <Box sx={{display: "flex", alignItems: 'center', justifyContent: 'space-between'}}>
                            <Typography sx={{color: '#171D41', fontWeight: 700, fontSize: '24px'}}>
                                Create a new note
                            </Typography>
                            {
                                this.state?.upload['status'] === true?
                                    <Stack 
                                        spacing={'4px'} 
                                        sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}
                                    >
                                        <ThumbUpOutlinedIcon/>
                                        <Typography sx={{color: '#A5A5A6', fontWeight: 400, fontSize: '12px'}}>
                                            Your file has been saved 
                                        </Typography>
                                    </Stack>
                                    :
                                    <Stack spacing={'4px'} sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                                            <Box 
                                                sx={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-end'
                                                }}
                                                onClick={(event)=> this.fileInputRef.current.click()}
                                            >
                                                <input 
                                                    ref={this.fileInputRef} 
                                                    type='file' 
                                                    onChange = {this.handleFileChange}
                                                    style={{display: 'none'}}
                                                />
                                                <IconButton>
                                                    <CloudUploadOutlinedIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        {
                                            this.state?.file === null?
                                                ''
                                                :
                                                <Box>
                                                    <Button 
                                                        variant="contained"
                                                        color={'success'}     
                                                        size={'small'}                   
                                                        onClick = {this.uploadFile}
                                                    >
                                                        Save
                                                    </Button>
                                                </Box>
                                        }
                                        <Typography sx={{color: '#A5A5A6', fontWeight: 400, fontSize: '12px'}}>
                                            {this.state?.file === null? 'Upload PDF here': 'Save to confirm upload'} 
                                        </Typography>
                                    </Stack>
                            }
                            
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{py: '16px'}}>
                        <Stack spacing={'16px'}>                            
                            <CustomTextField
                                name = {'notesTitle'}
                                type = {'text'}
                                label = {'Notes Title'}
                                placeholder = {'Enter title of the note'}
                                value = {this.state?.fields[`notesTitle`]?.value || ''}
                                disabled = {false}
                                required = {true}
                                error = {this.state?.fields[`notesTitle`]?.error}
                                helperText = {this.state?.fields[`notesTitle`]?.errorText || ''}
                                changeHandler = {this.updateFields}
                            /> 
                            <CustomSelect 
                                name = {'subject'}
                                label = {'Subject'}
                                value = {this.state?.fields?.subject?.value|| ''}
                                placeholder = {''}
                                error = {false}
                                helperText = {''}
                                disabled = {true}
                                changeHandler = {this.updateFields}
                                populator = {populators.populateSubject}
                            />
                            <CustomTextArea 
                                name = {'notesDescription'}
                                type = {'text'}
                                label = {'Description'}
                                value = {this.state?.fields['notesDescription']?.value || ''}
                                placeholder = {'Enter description'}
                                error = {this.state?.fields['notesDescription']?.error}
                                required={true}
                                helperText = {this.state?.fields['notesDescription']?.errorText || ''}
                                disabled = {false}
                                changeHandler = {this.updateFields}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{mt: '16px', px: '32px'}}>
                        <Button 
                            variant="outlined" 
                            endIcon={<SaveOutlinedIcon />}
                            color={'primary'}            
                            disabled = {this.state?.upload?.status === false}            
                            onClick = {this.handleValidateSaveForm}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

                <Button 
                    variant="outlined" 
                    endIcon={<FileUploadOutlinedIcon />}
                    color={'primary'}                        
                    onClick = {this.openModal}
                >
                    Upload
                </Button>
            </React.Fragment>
        )
    }
};

export default CreateNoteMount;