import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DeviceInfoPanel from '../elements/DeviceInfoPanel';
import RoomInfoPanel from '../elements/RoomInfoPanel';
import DeviceSettingsPanel from '../elements/DeviceSettingsPanel';
import DeviceAnalyticsPanel from '../elements/DeviceAnalyticsPanel';

import { requestEditRoom } from '../services/deviceServices';

const getDeviceByIdentifier = (user, identifier) => {
    let ret = null;

    user.devices.forEach(dev => {
        if (dev.identifier === identifier) ret = dev;
    });

    return ret;
}

const updateDevice = (newDev, updateUser) => {
    requestEditRoom(newDev, (res) => {
        console.log("response:")
        console.log(res)
        if (!res.error) {
            updateUser(res.user);
        }
    });
}

function DeviceDetailsPanel(props) {
    const device = props.device;

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
                <DeviceInfoPanel
                    device={device}
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <RoomInfoPanel
                    room={device.room}
                    updateRoom={(name, desc, volume) => {
                        let updatedDevice = props.device;
                        updatedDevice.room = {
                            name: name,
                            description: desc,
                            volume: volume
                        };

                        updateDevice(updatedDevice, props.updateUser);
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <DeviceSettingsPanel
                    device={device}
                />
            </Grid>
        </Grid>
    );
}

export default function DevicePage(props) {

    let identifier = window.location.pathname.split("/")[2];

    const [detailsExpanded, setDetailsExpanded] = useState(true);
    const [dashboardExpanded, setDashboardExpanded] = useState(true);

    if (!props.user) return null;

    let device = getDeviceByIdentifier(props.user, identifier);

    if (!device) return null;

    return (
        <div>
            <Typography variant="h5">Device {device.identifier}</Typography><br />
            <Accordion expanded={detailsExpanded}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    onClick={() => setDetailsExpanded(!detailsExpanded)}
                    id="panel1a-header"
                >
                    <Typography variant="h6">Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <DeviceDetailsPanel 
                        device={device} 
                        updateUser={props.updateUser}
                    />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={dashboardExpanded}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    onClick={() => setDashboardExpanded(!dashboardExpanded)}
                    id="panel2a-header"
                >
                    <Typography variant="h6">Analytics</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <DeviceAnalyticsPanel 
                        device={device}
                    />
                </AccordionDetails>
            </Accordion>
        </div>
    );
}