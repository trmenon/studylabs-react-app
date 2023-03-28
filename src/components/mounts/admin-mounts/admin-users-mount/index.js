import React, { Component} from "react";
import moment from "moment/moment";

// Services Imports
import { services } from "../../../../services/api";

// HOC Imports
import { CustomTextField } from "../../../common";

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
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SettingsBackupRestoreOutlinedIcon from '@mui/icons-material/SettingsBackupRestoreOutlined';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// Constants
import { users_form_fields } from "./form-fields";

class AdminUsersMount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: {data: [], count: 0},
            disableFormFields: false,
            formFields: {
                firstName: {error: false, errorText: '', value: ''},
                lastName: {error: false, errorText: '', value: ''},
                email: {error: false, errorText: '', value: ''},
                password: {error: false, errorText: '', value: ''},
                confirm_password: {error: false, errorText: '', value: ''},
            },
            openModal: false,
            toaster: {open: false, message: ''}
        }
    }
    // Life Cycle Methods
    componentDidMount() {
        this.fetchAllUsersService();
    }
    componentDidUpdate() {
        // console.log('[UPDATE] Admin Users Mount');
        // console.log(this.state);
    }

    // API Calls
    createNewTutorServices = ()=> {
        const data = {
            firstName: this.state?.formFields['firstName']?.value,
            lastName: this.state?.formFields['lastName']?.value,
            email: this.state?.formFields['email']?.value,
            password: this.state?.formFields['password']?.value,
        };
        this.clearFields();
        try{
            services
            .userServices
            .createTutorAccount(data)
            .subscribe({
                next: (response)=> {
                    if(response && response?.success === true) {
                        this.setState({
                            ...this.state,
                            toaster: {
                                open: true, 
                                message: response?.message || 'New tutor added'
                            }
                        }, ()=> this.fetchAllUsersService())
                    }else {
                        this.setState({
                            ...this.state,
                            toaster: {
                                open: true, 
                                message: response?.message || 'Unable to add new tutor'
                            }
                        })
                    }
                },
                error: (error)=> {
                    console.log('[ERROR] Creating new tutor');
                    console.log(error);
                    this.setState({
                        ...this.state,
                        toaster: {
                            open: true, 
                            message:'Server busy at the moment. Please try after sometime'
                        }
                    })
                },
            })
        }catch(err) {
            console.log('[ERROR] Creating new tutor');
            console.log(err);
            this.setState({
                ...this.state,
                toaster: {
                    open: true, 
                    message:'Unexpected error occured. Please try after sometime'
                }
            })
        }
    }
    fetchAllUsersService = ()=> {
        try{
            services
            .userServices
            .fetchAllUsers()
            .subscribe({
                next:(response)=> {
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
                                data: response?.data?.data,
                                count: response?.data?.count
                            }
                        })
                    }
                },
                error:(error)=> {
                    console.log('[ERROR] Fetching all usersr');
                    console.log(error);  
                },
            })
        }catch(err) {
            console.log('[ERROR] Fetching all users, api error');
            console.log(err);
        }
    }
    fetchUserByIdService = (id)=> {
        try{
            services
            .userServices
            .fetchUserById(id)
            .subscribe({
                next: (response)=> {
                    if(response && response?.success === true && response?.data) {
                        this.setState({
                            ...this.state,
                            disableFormFields: true,
                            formFields: {
                                firstName: {error: false, errorText: '', value: response?.data['firstName'] || ''},
                                lastName: {error: false, errorText: '', value: response?.data['lastName'] || ''},
                                email: {error: false, errorText: '', value: response?.data['email'] || ''},
                                password: {error: false, errorText: '', value: response?.data['password'] || ''},
                                confirm_password: {error: false, errorText: '', value: response?.data['password'] || ''},
                            },
                            openModal: true,
                        })
                    }else {
                        this.setState({
                            ...this.state,
                            toaster: {open: true, message: response?.message || 'Unable to get data at the moment. Please try again later'}
                        })
                    }
                },
                error: (error)=> {
                    console.log('[ERROR] Getting user details by user id');
                    console.log(error);
                    this.setState({
                        ...this.state,
                        toaster: {open: true, message: 'Server busy. Please try again later'}
                    })
                },
            })
        }catch(err) {
            console.log('[ERROR] Getting user details by user id');
            console.log(err);
            this.setState({
                ...this.state,
                toaster: {open: true, message: 'Unexpected error occured. Please try again later'}
            })
        }
    }
    deleteUserByIdService = (id)=> {
        try{
            services
            .userServices
            .deleteUserById(id)
            .subscribe({
                next: (response)=> {
                    if(response && response?.success === true){
                        this.setState({
                            ...this.state,
                            toaster: {open: true, message: response?.message || 'Changes to user has been made'}
                        }, ()=> this.fetchAllUsersService())
                    }else{
                        this.setState({
                            ...this.state,
                            toaster: {open: true, message: response?.message || 'Unable to perform operation. Please try after sometime'}
                        })
                    }
                },
                error: (error)=> {
                    console.log('[ERROR] Deleting user by id');
                    console.log(error);
                    this.setState({
                        ...this.state,
                        toaster: {open: true, message: 'Server busy. Please try after sometime'}
                    })
                },
            })
        }catch(err) {
            console.log('[ERROR] Deleting user by id');
            console.log(err);
            this.setState({
                ...this.state,
                toaster: {open: true, message: 'Unexpected error occured. Please try after sometime'}
            })
        }
    }

    // Event Handlers
    clearFields = ()=> {
        this.setState({
            ...this.state,
            formFields: {
                firstName: {error: false, errorText: '', value: ''},
                lastName: {error: false, errorText: '', value: ''},
                email: {error: false, errorText: '', value: ''},
                password: {error: false, errorText: '', value: ''},
                confirm_password: {error: false, errorText: '', value: ''},
            }
        })
    }
    closeModal = ()=> this.setState({...this.state, disableFormFields: false, openModal: false}, ()=> this.clearFields());
    addTutorDriver = ()=> this.setState({...this.state, disableFormFields: false, openModal: true});
    updateFields = ({field, value})=> {
        let current = this.state?.formFields;
        current[`${field}`] = {
            ...current[`${field}`],
            value: value
        };
        this.setState({...this.state, formFields: current})
    }
    createTutor = ()=> {
        this.setState({
            ...this.state,
            formFields: {
                firstName: {
                    ...this.state?.formFields['firstName'],
                    error: this.state?.formFields['firstName']?.value.length > 0? false: true, 
                    errorText: this.state?.formFields['firstName']?.value.length > 0?'': 'First name can not be empty', 
                },
                lastName: {
                    ...this.state?.formFields['lastName'],
                    error: this.state?.formFields['lastName']?.value.length > 0? false: true, 
                    errorText: this.state?.formFields['lastName']?.value.length > 0?'': 'Last name can not be empty', 
                },
                email: {
                    ...this.state?.formFields['email'],
                    error: this.state?.formFields['email']?.value.length > 0? false: true, 
                    errorText: this.state?.formFields['email']?.value.length > 0?'': 'Email can not be empty', 
                },
                password: {
                    ...this.state?.formFields['password'],
                    error: this.state?.formFields['password']?.value.length > 0? false: true, 
                    errorText: this.state?.formFields['password']?.value.length > 0?'': 'Password can not be empty', 
                },
                confirm_password: {
                    ...this.state?.formFields['confirm_password'],
                    error: this.state?.formFields['confirm_password']?.value === this.state?.formFields['password']?.value? false: true, 
                    errorText: this.state?.formFields['confirm_password']?.value === this.state?.formFields['password']?.value?'': 'Passwords do not match', 
                },
            },
        }, ()=> {
            if(
                this.state?.formFields['firstName']?.error === false &&
                this.state?.formFields['lastName']?.error === false &&
                this.state?.formFields['email']?.error === false &&
                this.state?.formFields['password']?.error === false &&
                this.state?.formFields['confirm_password']?.error === false
            ) {
                this.setState({
                    ...this.state, 
                    disableFormFields: false, 
                    openModal: false
                }, ()=> this.createNewTutorServices())
                
            }
        })
    }
    closeSnackbar = ()=> this.setState({...this.state, toaster:{open: false, message: ''}});

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
                    sx={{
                        '& .MuiDialog-paper': {
                            borderRadius: '24px',
                            py: '16px'
                        },
                    }}
                >
                    <DialogTitle sx={{borderBottom: '1px solid #CCC', mb: '16px'}}>
                        {
                            this.state?.disableFormFields === true? 'View User': 'Add Tutor'
                        }
                    </DialogTitle>
                    <DialogContent sx={{py: '16px'}}>
                        <Grid 
                            container 
                            spacing={2}
                        >
                        {
                            Object.values(users_form_fields).map((element)=> {
                                return(
                                    <Grid 
                                        key={element?.key} 
                                        item 
                                        xs={element?.width['xs']} 
                                        md={element?.width['md']}
                                    >
                                        <CustomTextField
                                            name = {element?.name || ''}
                                            type = {element?.type || 'text'}
                                            label = {element?.label || ''}
                                            placeholder = {element?.placeholder || ''}
                                            value = {this.state?.formFields[`${element?.mappingId}`]?.value || ''}
                                            disabled = {this.state?.disableFormFields}
                                            required = {element?.required}
                                            error = {this.state?.formFields[`${element?.mappingId}`]?.error}
                                            helperText = {this.state?.formFields[`${element?.mappingId}`]?.errorText || ''}
                                            changeHandler = {this.updateFields}
                                        />
                                    </Grid>
                                )
                            })
                        }
                        </Grid>
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
                                    onClick = {this.createTutor}
                                >
                                    Add Tutor
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
                        onClick = {this.addTutorDriver}
                    >
                        Add a new tutor
                    </Button>
                </Box>

                <Box sx={{width: '100%', mt: '24px'}}>
                    <TableContainer>
                        <Table sx={{ width: '100%',}} size="small">
                            <caption>{this.state?.tableData['count']} Registered Users</caption>
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
                                        Email
                                    </TableCell>
                                    <TableCell 
                                        align="left" 
                                        sx={{fontSize: '16px', fontWeight: 600, color: '#454848'}}
                                    >
                                        Role
                                    </TableCell>
                                    <TableCell 
                                        align="left" 
                                        sx={{fontSize: '16px', fontWeight: 600, color: '#454848'}}
                                    >
                                        Status
                                    </TableCell>
                                    <TableCell 
                                        align="left" 
                                        sx={{fontSize: '16px', fontWeight: 600, color: '#454848'}}
                                    >
                                        Boarded
                                    </TableCell>
                                    <TableCell 
                                        align="left" 
                                        sx={{fontSize: '16px', fontWeight: 600, color: '#454848'}}
                                    >
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state?.tableData.count === 0?
                                        <TableRow>
                                            <TableCell align="left" colSpan={7}>
                                                <Alert severity="info">No users to show</Alert>
                                            </TableCell>
                                        </TableRow>
                                        :
                                        this.state?.tableData.data.filter((data)=>
                                            data.admin === false
                                        ).map((row)=> {
                                            return(
                                                <TableRow
                                                    key={row._id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="left">
                                                        <Avatar sx={{ bgcolor: lightBlue[700] }}>
                                                            {`${row?.firstName[0]}${row?.lastName[0]}`}
                                                        </Avatar>
                                                    </TableCell>
                                                    <TableCell 
                                                        align="left"
                                                        sx={{fontSize: '14px', fontWeight: 400, color: '#011328'}}
                                                    >                                                        
                                                        {`${row?.firstName} ${row?.lastName}`}
                                                    </TableCell>
                                                    <TableCell 
                                                        align="left"
                                                        sx={{fontSize: '14px', fontWeight: 400, color: '#011328'}}
                                                    >
                                                        {row?.email}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Chip 
                                                            label= {row?.tutor === true? 'Tutor': 'Student'}
                                                            color= {row?.tutor === true? 'secondary': 'primary'} 
                                                            variant="outlined" 
                                                        />
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Chip 
                                                            label= {row?.isDeleted === true? 'Inactive': 'Active'}
                                                            color= {row?.isDeleted === true? 'warning': 'success'} 
                                                            variant="outlined" 
                                                        />
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
                                                    <TableCell align="left">
                                                        <Stack direction={'row'} spacing={0}>
                                                            <IconButton onClick={()=> this.deleteUserByIdService(row?._id)}>
                                                                {
                                                                    row?.isDeleted === true?
                                                                        <SettingsBackupRestoreOutlinedIcon />
                                                                        :
                                                                        <DeleteOutlineOutlinedIcon />
                                                                }
                                                                
                                                            </IconButton>
                                                            <IconButton onClick={()=> this.fetchUserByIdService(row?._id)}>
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

export default AdminUsersMount;