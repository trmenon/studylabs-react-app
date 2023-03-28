import React from "react";
import canvas from '../../../../assets/canvas.jpg';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const AdminReportsMount = ()=> {
    return(
        <Box 
            sx={{
                width: '100%',
                display: 'block',
                mt: '68px'
            }}
        >
            <img
                width={'458px'}
                height={'356px'}
                src={canvas}
            />
            <Typography gutterBottom variant="h6" component="div" sx={{fontWeight: 700}}>
                This feature will be released soon...
            </Typography>
        </Box>
    )
}

export default AdminReportsMount;