import React, { Component} from "react";
import moment from "moment/moment";

// Services Imports
import { services } from "../../../../services/api";

// HOC Imports
import { CustomTextField, CustomTextArea } from "../../../common";

// Legacy Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { lightBlue} from '@mui/material/colors';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SettingsBackupRestoreOutlinedIcon from '@mui/icons-material/SettingsBackupRestoreOutlined';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Alert from '@mui/material/Alert';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';

//  Constants

class AdminSubjectsMount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: {data: [], count: 0},
            disableFormFields: false,
            formFields: {
                subjectTitle: {error: false, errorText: '', value: ''},
                subjectDescription: {error: false, errorText: '', value: ''},
            },
            openModal: false,
            toaster: {open: false, message: ''}
        }
    }

    // lifecycle methods
    componentDidMount() {
        this.fetchAllSubjectService();
    }
    componentDidUpdate() {
        console.log('[COMPONENT UPDATE] Admin subjects mount');
        console.log(this.state);
    }

    // API Calls
    fetchAllSubjectService = ()=> {
        try{
            services
            .subjectServices
            .getAllSubjects()
            .subscribe({
                next: (response)=> {
                    if(
                        response &&
                        response?.success === true &&
                        response?.data &&
                        response?.data?.data &&
                        Array.isArray(response?.data?.data)
                    ) {
                        this.setState({
                            ...this.state,
                            tableData: {
                                count: response?.data?.count,
                                data: response?.data?.data
                            }
                        })
                    }else {
                        this.setState({
                            ...this.state, 
                            toaster: {
                                open: true, 
                                message: response?.message || 'Unexpected error occured. Please try after sometime'
                            }
                        })
                    }
                },
                error: (error)=> {
                    console.log('[ERROR] Getting all subjects');
                    console.log(error);
                    this.setState({...this.state, toaster: {open: true, message: 'Unexpected error occured. Please try after sometime'}})
                },
            })
        }catch(err) {
            console.log('[ERROR] Getting all subjects');
            console.log(err);
            this.setState({...this.state, toaster: {open: true, message: 'Unexpected error occured. Please try after sometime'}})
        }
    }
    createNewSubjectService = ()=> {
        const data = {
            subjectTitle : this.state?.formFields['subjectTitle']?.value || '',
            subjectDescription : this.state?.formFields['subjectDescription']?.value || '',
        };
        try{
            services
            .subjectServices
            .createNewSubject(data)
            .subscribe({
                next: (response)=> {
                    if(response && response?.success === true) {
                        this.setState({
                            ...this.state, 
                            formFields: {
                                subjectTitle: {error: false, errorText: '', value: ''},
                                subjectDescription: {error: false, errorText: '', value: ''},
                            },
                            toaster: {
                                open: true, 
                                message: response?.message || 'New subject has been added'
                            }
                        }, ()=> this.fetchAllSubjectService())
                    }else {
                        this.setState({
                            ...this.state, 
                            toaster: {
                                open: true, 
                                message: response?.message || 'Unable to add subject at the moment. Please try after sometime'
                            }
                        })
                    }
                },
                error: (error)=> {
                    console.log('[ERROR] Getting all subjects');
                    console.log(error);
                    this.setState({...this.state, toaster: {open: true, message: 'Server busy. Please try after sometime'}})
                },
            })
        }catch(err) {
            console.log('[ERROR] Getting all subjects');
            console.log(err);
            this.setState({...this.state, toaster: {open: true, message: 'Unexpected error occured. Please try after sometime'}})
        }
    }
    handleRowClick = (id) => {
        try{
            services
            .subjectServices
            .getSubjectById(id)
            .subscribe({
                next: (response)=> {
                    if(response && response?.success === true && response?.data) {
                        this.setState({
                            ...this.state,
                            disableFormFields: true,
                            formFields: {
                                subjectTitle: {error: false, errorText: '', value: response?.data['subjectTitle'] || ''},
                                subjectDescription: {error: false, errorText: '', value: response?.data['subjectDescription'] || ''},
                            },
                            openModal: true,
                        })
                    }else {
                        this.setState({
                            ...this.state, 
                            toaster: {
                                open: true, 
                                message: response?.message || 'Unable to get subject information at the time. Please try after sometime'
                            }
                        })
                    }
                },
                error: (error)=> {
                    console.log('[ERROR] Getting subject details');
                    console.log(error);
                    this.setState({...this.state, toaster: {open: true, message: 'Server busy. Please try after sometime'}})
                },
            })
        }catch(err) {
            console.log('[ERROR] Getting subject details');
            console.log(err);
            this.setState({...this.state, toaster: {open: true, message: 'Unexpected error occured. Please try after sometime'}})
        }
    }

    // Event Handlers
    closeSnackbar = ()=> this.setState({...this.state, toaster:{open: false, message: ''}});
    closeModal = ()=> this.setState({...this.state, disableFormFields: false, openModal: false}, ()=> this.clearFields());
    clearFields = ()=> {
        this.setState({
            ...this.state,
            formFields: {
                subjectTitle: {error: false, errorText: '', value: ''},
                subjectDescription: {error: false, errorText: '', value: ''},
            }
        })
    }
    updateFields = ({field, value})=> {
        let current = this.state?.formFields;
        current[`${field}`] = {
            ...current[`${field}`],
            value: value
        };
        this.setState({...this.state, formFields: current})
    }
    createSubjectDriver = ()=> {
        this.setState({
            ...this.state,
            formFields: {
                subjectTitle: {
                    ...this.state?.formFields['subjectTitle'],
                    error: this.state?.formFields['subjectTitle']?.value.length > 0? false: true, 
                    errorText: this.state?.formFields['subjectTitle']?.value.length > 0?'': 'Title can not be empty', 
                },
                subjectDescription: {
                    ...this.state?.formFields['subjectDescription'],
                    error: this.state?.formFields['subjectDescription']?.value.length > 0? false: true, 
                    errorText: this.state?.formFields['subjectDescription']?.value.length > 0?'': 'Description can not be empty', 
                },
            },
        }, ()=> {
            if(
                this.state?.formFields['subjectTitle']?.error === false &&
                this.state?.formFields['subjectDescription']?.error === false
            ) {
                console.log('Validation success');
                this.setState({
                    ...this.state, 
                    disableFormFields: false, 
                    openModal: false
                }, ()=> this.createNewSubjectService())
                
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
                    open={this.state?.openModal} 
                    onClose={this.closeModal} 
                    fullWidth={true}
                    maxWidth={'md'}
                    sx={{'& .MuiDialog-paper': {borderRadius: '24px',py: '16px'},}}
                >
                    <DialogTitle sx={{borderBottom: '1px solid #CCC', mb: '16px'}}>
                        {
                            this.state?.disableFormFields === true? 'View Subject': 'Add Subject'
                        }
                    </DialogTitle>
                    <DialogContent sx={{py: '16px'}}>
                        <Stack spacing={'8px'}>
                            <CustomTextField
                                name = {'subjectTitle'}
                                type = {'text'}
                                label = {'Subject Title'}
                                placeholder = {'Enter subject title'}
                                value = {this.state?.formFields[`subjectTitle`]?.value || ''}
                                disabled = {this.state?.disableFormFields}
                                required = {true}
                                error = {this.state?.formFields[`subjectTitle`]?.error}
                                helperText = {this.state?.formFields[`subjectTitle`]?.errorText || ''}
                                changeHandler = {this.updateFields}
                            />
                            <CustomTextArea
                                name = {'subjectDescription'}
                                type = {'text'}
                                label = {'Subject Description'}
                                placeholder = {'Enter subject description'}
                                value = {this.state?.formFields[`subjectDescription`]?.value || ''}
                                disabled = {this.state?.disableFormFields}
                                required = {true}
                                error = {this.state?.formFields[`subjectDescription`]?.error}
                                helperText = {this.state?.formFields[`subjectDescription`]?.errorText || ''}
                                changeHandler = {this.updateFields}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{mt: '16px', px: '32px'}}>
                        {
                            this.state?.disableFormFields === true?
                                ''
                                :
                                <Button 
                                    variant="contained" 
                                    endIcon={<AddOutlinedIcon />}
                                    color={'secondary'}
                                    fullWidth
                                    onClick = {this.createSubjectDriver}
                                >
                                    Add Subject
                                </Button>
                        }
                    </DialogActions>
                </Dialog>

                <Box 
                    sx={{
                        width: '100%',
                        px: {xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '20px'},
                        mt: {xs: '8px', sm: '12px', md: '16px', lg: '20px', xl: '24px'},
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'flex-end'
                    }}
                >
                    <Button 
                        variant="outlined" 
                        endIcon={<AddOutlinedIcon />}
                        color={'secondary'}                        
                        onClick = {()=> this.setState({...this.state, disableFormFields: false, openModal: true})}
                    >
                        Add a new subject
                    </Button>
                </Box>

                <Box sx={{width: '100%', mt: '24px'}}>
                    <TableContainer>
                        <Table sx={{ width: '100%',}} size="small">
                            <caption>{this.state?.tableData['count']} Subjects</caption>
                            <TableHead >
                                <TableRow>
                                    <TableCell align="left"></TableCell>
                                    <TableCell 
                                        sx={{fontSize: '16px', fontWeight: 600, color: '#454848'}}
                                    >
                                        Name
                                    </TableCell>
                                    <TableCell 
                                        align="left" 
                                        sx={{fontSize: '16px', fontWeight: 600, color: '#454848'}}
                                    >
                                        Added
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state?.tableData['count'] === 0?
                                        <TableRow>
                                            <TableCell align="left" colSpan={3}>
                                                <Alert severity="info">No subjects to show</Alert>
                                            </TableCell>
                                        </TableRow>
                                        :
                                        this.state?.tableData?.data.map((row)=> {
                                            return(
                                                <TableRow
                                                    key={row._id}
                                                    sx={{ '& :hover': {cursor: 'pointer',}}}
                                                    onClick = {()=> this.handleRowClick(row?._id)}
                                                >
                                                    <TableCell align="left">
                                                        <Avatar sx={{ bgcolor: lightBlue[700], width: 32, height: 32,}}>
                                                            <LocalLibraryOutlinedIcon/>
                                                        </Avatar>
                                                    </TableCell>
                                                    <TableCell 
                                                        align="left"
                                                        sx={{fontSize: '14px', fontWeight: 400, color: '#011328'}}
                                                    >                                                        
                                                        {row?.subjectTitle}
                                                    </TableCell>
                                                    <TableCell 
                                                        align="left"
                                                        sx={{fontSize: '14px', fontWeight: 400, color: '#050a10'}}
                                                    >
                                                        <Chip 
                                                            color={'info'}
                                                            variant = {'outlined'}
                                                            icon={<CalendarMonthOutlinedIcon />} 
                                                            label= {moment(row?.createdAt).format('ll')} 
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </React.Fragment>
        )
    }
}

export default AdminSubjectsMount;