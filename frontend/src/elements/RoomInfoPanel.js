import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

function Field(props) {
    return (
        <div>
            <TextField
                id={"outlined-input" + props.label}
                label={props.label}
                defaultValue={props.text}
                style={{width: "100%"}}
                variant="outlined"
                onChange={(event) => {
                    props.setValue(event.target.value);
                }}
            /><br /><br/>
        </div>
    );
}

export default function RoomInfoPanel(props) {

    const [name, setName] = useState(props.room ? props.room.name : "");
    const [desc, setDesc] = useState(props.room ? props.room.description : "");
    const [volume, setVolume] = useState(props.room ? props.room.volume : 0);

    return (
        <Paper style={{ padding: "15px" }}>
            <Typography variant="h6">Room</Typography><br />
            <div style={{width: "100%"}}> 
                <Field
                    label="Name"
                    text={name} 
                    setValue={setName} />
                <Field
                    label="Description"
                    text={desc} 
                    setValue={setDesc} />
                <TextField 
                    type="number"
                    defaultValue={volume}
                    label="Room volume"
                    variant="outlined"
                    style={{width: "100%"}}
                    onChange={event => setVolume(event.target.value)}
                /><br/><br/>
                <Button
                    variant="contained"
                    color="primary"    
                    style={{width: "100%"}}
                    onClick={() => props.updateRoom(name, desc, volume)}
                >
                    Update room
                </Button>
            </div>
        </Paper>
    );
}