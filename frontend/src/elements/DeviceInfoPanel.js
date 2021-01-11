import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

function ReadOnlyField(props) {
    return (
        <div>
            <TextField
                disabled
                id={"outlined-read-only-input" + props.label}
                label={props.label}
                defaultValue={props.text}
                InputProps={{
                    readOnly: true,
                }}
                style={{width: "100%"}}
                variant="outlined"
            /><br /><br/>
        </div>
    );
}

export default function DeviceInfoPanel(props) {

    return (
        <Paper style={{ padding: "15px" }}>
            <Typography variant="h6">Information</Typography><br />
            <div style={{width: "100%"}}> 
                <ReadOnlyField
                    label="Identifier"
                    text={props.device.identifier} />
                <ReadOnlyField
                    label="Current public URL"
                    text={props.device.public_url} />
                    
            </div>
        </Paper>
    );
}