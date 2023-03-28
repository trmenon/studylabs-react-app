import React from "react";
import canvas from '../../../../assets/canvas.jpg';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const TutorReportsMount = ()=> {
    return (
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
                We will be releasing this feature soon...
            </Typography>
        </Box>
      );
};

export default TutorReportsMount;