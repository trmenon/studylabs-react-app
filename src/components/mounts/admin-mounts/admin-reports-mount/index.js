import React, { useState} from "react";

// Legacy imports
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

// Tab Constants
import { TABS } from "./tabs";

const AdminReportsMount = ()=> {
    // States
    const [ tab, setTab] = useState(TABS[0]?.value);

    // Event Handlers
    const handleChange = (event, newValue) => setTab(newValue);

    // Renderer
    return(
        <Box sx={{width: '100%'}}>
            <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                    <TabList onChange={handleChange}>
                        {
                            TABS.map((element)=> {
                                return(
                                    <Tab
                                        key = {element?.key} 
                                        value = {element?.value} 
                                        label = {element?.label}
                                    />
                                )
                            })
                        }
                    </TabList>
                </Box>
                <Box sx={{mt: '24px', width: '100%'}}>
                    {
                        TABS.map((element)=> {
                            return(
                                <TabPanel 
                                    key = {`PANEL-${element?.key}`} 
                                    value = {element?.value}
                                >
                                    {element?.node}
                                </TabPanel>
                            )
                        })
                    }
                </Box>
            </TabContext>
        </Box>
    )
}

export default AdminReportsMount;