import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { requestGetParams, requestEditParams } from '../services/deviceServices';

function Field(props) {
    return (
        <div>
            <TextField
                name={props.name}
                id={"outlined-input" + props.label}
                label={props.label}
                defaultValue={props.text}
                InputProps={{
                    readOnly: false,
                }}
                style={{ width: "100%" }}
                onChange={props.handleInputChange}
                variant="outlined"
            /><br /><br />
        </div>
    );
}

class DeviceSettingsPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tem: -1,
            tes: -1,
            maxgas: -1,
            maxhcho: -1,
            dev_online: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        requestGetParams(this.props.device.identifier, res => {
            console.log("resssp")
            console.log(res)
            if (!res.error) {
                return this.setState({
                    tem: res.TEM,
                    tes: res.TES,
                    maxgas: res.MAXGAS,
                    maxhcho: res.MAXHCHO,
                    dev_online: true
                });
            } 

            this.setState({
                dev_online: false
            });

        })
    }   

    handleInputChange(event) {
        let target = event.target;
        let name = target.name;
        let value = target.value;

        this.setState({
            [name]: value
        })
    }

    handleSubmit() {
        console.log("submit clicked")
        let { tem, tes, maxgas, maxhcho } = this.state;
        requestEditParams(this.props.device.identifier, tes, tem, maxgas, maxhcho, res => {
            console.log("rewp")
            console.log(res)

            if (!res.success) {
                alert("Operation failed")
            } else {
                alert("Operation succeeded")
            }
        })
    }

    render() {
        
        if (!this.state.dev_online) {
            return (
                <Paper style = {{ padding: "15px" }}>
                    <Typography variant="h6">Parameters</Typography><br />
                    <Typography variant="subtitle1">Can't connect to device</Typography>
                </Paper>
            );
        }

        return(
            <Paper style = {{ padding: "15px" }}>
                <Typography variant="h6">Parameters</Typography><br />
                <div style={{ width: "100%" }}>
                    <Field
                        name="tem"
                        label="Seconds between measurements"
                        text={this.state.tem} 
                        handleInputChange={this.handleInputChange}
                        readOnly={false}/>
                    <Field
                        name="tes"
                        label="Seconds between syncs"
                        text={this.state.tes} 
                        handleInputChange={this.handleInputChange}
                        readOnly={false}/>
                    <Field
                        name="maxgas"
                        label="Max gas value"
                        text={this.state.maxgas}
                        handleInputChange={this.handleInputChange}
                        readOnly={false}/>
                    <Field
                        name="maxhcho"
                        label="Max HCHO value"
                        text={this.state.maxhcho}
                        handleInputChange={this.handleInputChange}
                        readOnly={false} />
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ width: "100%" }}
                        onClick={this.handleSubmit}
                    >
                        Update settings
                    </Button>
                </div>
            </Paper >
        );
    }

}

export default DeviceSettingsPanel;