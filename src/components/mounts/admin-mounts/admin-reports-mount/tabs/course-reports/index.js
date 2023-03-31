import React, {Component} from "react";
import moment from "moment/moment";

// Services
import { services } from "../../../../../../services/api";

// Legacy Imports
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AdfScannerOutlinedIcon from '@mui/icons-material/AdfScannerOutlined';

class CourseReport extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.state={tableData: {count: 0, data: []}}
    }

    // Lifecycle Methods
    componentDidMount(){this.fetchAllClasses()}
    componentDidUpdate(){
        console.log('UPDATE: User Reports');
        console.log(this.state);
    }

    // API Calls
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
                    ){
                        this.setState({
                            ...this.state,
                            tableData: {
                                count: response?.data?.count || 0,
                                data: response?.data?.data || []
                            }
                        })
                    }                        
                    
                },
                error: (error)=> {
                    console.log('[ERROR] Populating users by user-role');
                    console.log(error);
                },
            })
        }catch(err){
            console.log('[ERROR: API] Populating users by user-role');
            console.log(err);
        }
    }

    // Event Handlers
    handleExport = ()=> {}

    // Renderer
    render() {
        return(
            <React.Fragment>
                <Paper
                    elevation={3} 
                    sx={{
                        width: '100%', 
                        pb: '8px', 
                        borderRadius: '24px', 
                        border: '1px solid #eaeaea', 
                        padding: '24px',
                        mb: '16px'
                    }}
                >
                    <Stack direction={'row'} spacing={2} sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography sx={{color: '#1e1c45', fontWeight: 600, fontSize: '20px'}}>
                            Course Reports
                        </Typography>
                        <Box sx={{display: 'flex', flexGrow: 1, justifyContent: 'flex-end'}}>
                            <IconButton 
                                color="secondary" 
                                size="large"
                                onClick = {this.handleExport}
                            >
                                <AdfScannerOutlinedIcon />
                            </IconButton>
                        </Box>
                    </Stack>
                </Paper>

                <TableContainer
                    ref= {this.ref}
                    sx={{
                        width: '100%',
                        borderRadius: '24px', 
                        border: '1px solid #eaeaea',
                    }}
                >
                    <Table sx={{ width: '100%' }} size="small" aria-label="a dense table">
                    <caption>{`Displaying ${this.state?.tableData['count']} courses`}</caption>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" sx={{fontWeight: 600, color: '#172423', fontSize: '14px'}}>Program</TableCell>
                                <TableCell align="left" sx={{fontWeight: 600, color: '#172423', fontSize: '14px'}}>Subject</TableCell>
                                <TableCell align="left" sx={{fontWeight: 600, color: '#172423', fontSize: '14px'}}>Enrollments</TableCell>
                                <TableCell align="left" sx={{fontWeight: 600, color: '#172423', fontSize: '14px'}}>Archives</TableCell>
                                <TableCell align="left" sx={{fontWeight: 600, color: '#172423', fontSize: '14px'}}>Created</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.state?.tableData?.data.map((row)=> {
                                    return(
                                        <TableRow
                                            key={row._id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">{row?.classTitle}</TableCell>
                                            <TableCell align="left">{row?.subject?.subjectTitle}</TableCell>
                                            <TableCell align="left">{row?.enrolled.length}</TableCell>
                                            <TableCell align="left">{row?.archives.length}</TableCell>
                                            <TableCell align="left">{moment(row?.createdAt).format('lll')}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </React.Fragment>
        )
    }
}

export default CourseReport;