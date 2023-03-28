import React, { Component} from 'react';
import moment from "moment/moment";

// Services Imports
import { services } from "../../../../services/api";
import { populators } from '../../../../services/api/populatorApi';

// HOC Imports
import { CustomTextField, CustomSelect, CustomTextArea } from "../../../common";

// Legacy Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { lightBlue} from '@mui/material/colors';
import CastForEducationOutlinedIcon from '@mui/icons-material/CastForEducationOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SettingsBackupRestoreOutlinedIcon from '@mui/icons-material/SettingsBackupRestoreOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// Constants

class AdminClassesMount extends Component {
    constructor(props) {
        super(props);
        this.state={
            tableData: {data: [], count: 0},
            disableFormFields: false,
            formFields: {
                classTitle: {error: false, errorText: '', value: ''},
                classDescription: {error: false, errorText: '', value: ''},
                handledBy: {error: false, errorText: '', value: ''},
                subject: {error: false, errorText: '', value: ''},
            },
            currentEnrolled: 0,
            currentArchives: 0,
            openModal: false,
            toaster: {open: false, message: ''}
        }
    }

    // Lifecycle methods
    componentDidMount(){this.fetchAllClassesService()}
    componentDidUpdate() {
        console.log('Component updated');
        console.log(this.state);
    }

    // APIs
    fetchAllClassesService = ()=> {
        try{
            services
            .classServices
            .fetchAllClasses()
            .subscribe({
                next: (response)=> {
                    console.log(response);
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
                        console.log('TODO Toasters');
                    }
                },
                error: (error)=> {
                    console.log('[ERROR] Tring to fetch all classes');
                    console.log(error);
                },
            })
        }catch(err) {
            console.log('[ERROR] fetching all classes api');
            console.log(err);
        }
    }
    createNewClassServices = ()=> {
        const payload = {
            classTitle: this.state?.formFields['classTitle']?.value,
            classDescription: this.state?.formFields['classDescription']?.value,
            handledBy: this.state?.formFields['handledBy']?.value,
            subject: this.state?.formFields['subject']?.value,
        };
        try{
            services
            .classServices
            .createNewClass(payload)
            .subscribe({
                next: (response)=> {
                    if(response && response?.success === true) {
                        this.fetchAllClassesService();
                    }else {
                        this.setState({
                            ...this.state, 
                            toaster: {
                                open: true, 
                                message: response?.message ||  'Unable to create new class at the moment. Please try after sometime.'
                            }
                        }) 
                    }
                },
                error: (error)=> {
                    console.log('[ERROR] Creating new class: API_ERROR');
                    console.log(error);
                    this.setState({...this.state, toaster: {open: true, message: 'Server busy. Please try after sometime.'}}) 
                },
            })
        }catch(err) {
            console.log('[ERROR] Creating new class: API_ERROR');
            console.log(err);
            this.setState({...this.state, toaster: {open: true, message: 'Unexpected error occured. Please try after sometime.'}})
        }
    }
    fetchClassByIdService = (id)=> {
        try{
            services
            .classServices
            .fetchClassById(id)
            .subscribe({
                next: (response)=> {
                    if(response && response?.success === true && response?.data){
                        this.setState({
                            ...this.state,
                            disableFormFields: true,
                            formFields: {
                                classTitle: {error: false, errorText: '', value: response?.data?.classTitle || ''},
                                classDescription: {error: false, errorText: '', value: response?.data?.classDescription || ''},
                                handledBy: {error: false, errorText: '', value: response?.data?.handledBy['_id'] ||''},
                                subject: {error: false, errorText: '', value: response?.data?.subject['_id'] ||''},
                            },
                            openModal: true,
                            currentEnrolled: response?.data?.enrolled.length,
                            currentArchives: response?.data?.archives.length
                        })
                    }else {
                        this.setState({
                            ...this.state, 
                            toaster: {
                                open: true, 
                                message: response?.message || 'Unable to process request. Please try after sometime'
                            }
                        });
                    }
                },
                error: (error)=> {
                    console.log('[ERROR] Fetching class information by class id');
                    console.log(error);
                    this.setState({...this.state, toaster: {open: true, message: 'Server busy. Please try after sometime'}});
                },
            })
        }catch(err) {
            console.log('[ERROR] Fetching class information by class id');
            console.log(err);
            this.setState({...this.state, toaster: {open: true, message: 'Unexpected error occured. Please try after sometime'}});
        }
    }
    toggeClassStatusService = (id)=> {
        try{
            services
            .classServices
            .toggleClassStatusById(id)
            .subscribe({
                next: (response)=> {
                    if(response && response?.success === true){
                        this.setState({
                            ...this.state, 
                            toaster: {
                                open: true, 
                                message: response?.message || 'Status has been changed'
                            }
                        }, ()=> this.fetchAllClassesService());
                    }else{
                        this.setState({
                            ...this.state, 
                            toaster: {
                                open: true, 
                                message: response?.message || 'Unable to process request. Please try after sometime'
                            }
                        });
                    }
                },
                error: (error)=> {
                    console.log('[ERROR] Fetching class information by class id');
                    console.log(error);
                    this.setState({...this.state, toaster: {open: true, message: 'Server busy. Please try after sometime'}});
                },
            })
        }catch(err) {
            console.log('[ERROR] Fetching class information by class id');
            console.log(err);
            this.setState({...this.state, toaster: {open: true, message: 'Unexpected error occured. Please try after sometime'}});
        }
    }

    // Event Handlers
    closeSnackbar = ()=> this.setState({...this.state, toaster:{open: false, message: ''}});
    addClassDriver = ()=> this.setState({...this.state, disableFormFields: false, openModal: true});
    clearFields = ()=> {
        this.setState({
            ...this.state,
            formFields: {
                classTitle: {error: false, errorText: '', value: ''},
                classDescription: {error: false, errorText: '', value: ''},
                handledBy: {error: false, errorText: '', value: ''},
                subject: {error: false, errorText: '', value: ''},
            }
        })
    }
    closeModal = ()=> this.setState({...this.state, disableFormFields: false, openModal: false}, ()=> this.clearFields());
    updateFields = ({field, value})=> {
        let current = this.state?.formFields;
        current[`${field}`] = {
            ...current[`${field}`],
            value: value
        };
        this.setState({...this.state, formFields: current})
    }
    createNewClass = ()=> {
        this.setState({
            ...this.state,
            formFields: {
                classTitle: {
                    ...this.state?.formFields['classTitle'],
                    error: this.state?.formFields['classTitle']?.value.length > 0? false: true, 
                    errorText: this.state?.formFields['classTitle']?.value.length > 0?'': 'Class-Title can not be empty', 
                },
                classDescription: {
                    ...this.state?.formFields['classDescription'],
                    error: this.state?.formFields['classDescription']?.value.length > 0? false: true, 
                    errorText: this.state?.formFields['classDescription']?.value.length > 0?'': 'Class-Description can not be empty', 
                },
                handledBy: {
                    ...this.state?.formFields['handledBy'],
                    error: this.state?.formFields['handledBy']?.value.length > 0? false: true, 
                    errorText: this.state?.formFields['handledBy']?.value.length > 0?'': 'Pick a tutor to continue', 
                },
                subject: {
                    ...this.state?.formFields['subject'],
                    error: this.state?.formFields['subject']?.value.length > 0? false: true, 
                    errorText: this.state?.formFields['subject']?.value.length > 0?'': 'Pick a subject to categorize class', 
                },
            },
        }, ()=> {
            if(
                this.state?.formFields['classTitle']?.error === false &&
                this.state?.formFields['handledBy']?.error === false &&
                this.state?.formFields['subject']?.error === false
            ) {
                this.setState({
                    ...this.state, 
                    disableFormFields: false, 
                    openModal: false
                }, ()=> this.createNewClassServices())
                
            }
        })
    }
    

    // renderer
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
                    sx={{
                        '& .MuiDialog-paper': {
                            borderRadius: '24px',
                            py: '16px'
                        },
                    }}
                >
                    <DialogTitle sx={{borderBottom: '1px solid #CCC', mb: '16px'}}>
                        {this.state?.disableFormFields === true? 'View Class': 'Add Class'}
                    </DialogTitle>
                    <DialogContent sx={{py: '16px'}}>
                        <Grid 
                            container 
                            spacing={2}
                        >
                            <Grid item xs={12} md={12}>
                                <CustomTextField
                                    name = {'classTitle'}
                                    type = {'text'}
                                    label = {'Class Title'}
                                    placeholder = {'Enter class title'}
                                    value = {this.state?.formFields[`classTitle`]?.value || ''}
                                    disabled = {this.state?.disableFormFields}
                                    required = {true}
                                    error = {this.state?.formFields[`classTitle`]?.error}
                                    helperText = {this.state?.formFields[`classTitle`]?.errorText || ''}
                                    changeHandler = {this.updateFields}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <CustomSelect 
                                    name = {'handledBy'}
                                    label = {'Designated Tutor'}
                                    value = {this.state?.formFields['handledBy']?.value || ''}
                                    placeholder = {'Pick tutor'}
                                    error = {this.state?.formFields['handledBy']?.error}
                                    helperText = {this.state?.formFields['handledBy']?.errorText || ''}
                                    disabled = {this.state?.disableFormFields}
                                    changeHandler = {this.updateFields}
                                    populator = {populators.populateTutors}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <CustomSelect 
                                    name = {'subject'}
                                    label = {'Subject'}
                                    value = {this.state?.formFields['subject']?.value || ''}
                                    placeholder = {'Pick subject'}
                                    error = {this.state?.formFields['subject']?.error}
                                    helperText = {this.state?.formFields['subject']?.errorText || ''}
                                    disabled = {this.state?.disableFormFields}
                                    changeHandler = {this.updateFields}
                                    populator = {populators.populateSubject}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <CustomTextArea 
                                    name = {'classDescription'}
                                    type = {'text'}
                                    label = {'Description'}
                                    value = {this.state?.formFields['classDescription']?.value || ''}
                                    placeholder = {'Pick subject'}
                                    error = {this.state?.formFields['classDescription']?.error}
                                    required={true}
                                    helperText = {this.state?.formFields['classDescription']?.errorText || ''}
                                    disabled = {this.state?.disableFormFields}
                                    changeHandler = {this.updateFields}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{mt: '16px', px: '32px'}}>
                        {
                            this.state?.disableFormFields === true?
                                <Stack direction={'row'} spacing = {'8px'}>
                                    <Chip 
                                        color={'info'}
                                        variant = {'outlined'}
                                        icon={<PeopleOutlineRoundedIcon />} 
                                        label= {`${this.state?.currentEnrolled} Enrolled`} 
                                    />
                                    <Chip 
                                        color={'primary'}
                                        variant = {'outlined'}
                                        icon={<LibraryBooksOutlinedIcon />} 
                                        label= {`${this.state?.currentArchives} Archives`} 
                                    />
                                </Stack>
                                :
                                <Button 
                                    variant="contained" 
                                    endIcon={<CheckOutlinedIcon />}
                                    color={'secondary'}
                                    fullWidth
                                    onClick = {this.createNewClass}
                                >
                                    Save Class
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
                        onClick = {this.addClassDriver}
                    >
                        Create Class
                    </Button>
                </Box>   

                <Box sx={{width: '100%', mt: '24px'}}>
                    <TableContainer>
                        <Table sx={{ width: '100%',}} size="small">
                            <caption>{this.state?.tableData['count']} Classes</caption>
                            <TableHead >
                                <TableRow>
                                    <TableCell align="left"></TableCell>
                                    <TableCell align="left" sx={{fontSize: '16px', fontWeight: 600, color: '#454848'}}>
                                        Class
                                    </TableCell>
                                    <TableCell align="left" sx={{fontSize: '16px', fontWeight: 600, color: '#454848'}}>
                                        Tutor
                                    </TableCell>
                                    <TableCell align="left" sx={{fontSize: '16px', fontWeight: 600, color: '#454848'}}>
                                        Status
                                    </TableCell>
                                    <TableCell align="left" sx={{fontSize: '16px', fontWeight: 600, color: '#454848'}}>
                                        Created
                                    </TableCell>
                                    <TableCell align="left" sx={{fontSize: '16px', fontWeight: 600, color: '#454848'}}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state?.tableData.count === 0?
                                        <TableRow>
                                            <TableCell align="left" colSpan={6}>
                                                <Alert severity="info">No classes to show</Alert>
                                            </TableCell>
                                        </TableRow>
                                        :
                                        this.state?.tableData['data'].map((row)=> {
                                            return(
                                                <TableRow  key={row._id}>
                                                    <TableCell align="left">
                                                        <Avatar sx={{ bgcolor: lightBlue[700] }}>
                                                            <CastForEducationOutlinedIcon/>
                                                        </Avatar>
                                                    </TableCell>
                                                    <TableCell align="left" sx={{fontSize: '14px', fontWeight: 400, color: '#011328'}}>                                                        
                                                        {row?.classTitle}
                                                    </TableCell>
                                                    <TableCell align="left" sx={{fontSize: '14px', fontWeight: 400, color: '#011328'}}>                                                        
                                                        {`${row?.handledBy?.firstName} ${row?.handledBy?.lastName}`}
                                                    </TableCell>
                                                    <TableCell align="left">                                                        
                                                        <Chip 
                                                            label= {row?.isActive === true? 'Open': 'Closed'}
                                                            color= {row?.isActive === true? 'secondary': 'warning'} 
                                                            variant="outlined" 
                                                        />
                                                    </TableCell>
                                                    <TableCell align="left">                                                        
                                                        <Chip 
                                                            color={'info'}
                                                            variant = {'outlined'}
                                                            icon={<CalendarMonthOutlinedIcon />} 
                                                            label= {moment(row?.createdAt).format('ll')} 
                                                        />
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Stack direction={'row'} spacing={0}>
                                                            <IconButton onClick={()=> this.toggeClassStatusService(row?._id)}>
                                                                {
                                                                    row?.isActive === false?
                                                                        <SettingsBackupRestoreOutlinedIcon />
                                                                        :
                                                                        <DeleteOutlineOutlinedIcon />
                                                                }
                                                                
                                                            </IconButton>
                                                            <IconButton onClick={()=> this.fetchClassByIdService(row?._id)}>
                                                                <VisibilityOutlinedIcon />
                                                            </IconButton>
                                                        </Stack> 
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

export default AdminClassesMount;