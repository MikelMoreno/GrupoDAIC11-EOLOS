import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

class DeviceList extends React.Component {

    render() {
        return (
            <div>
                <Typography variant="h5">Your devices:</Typography><br />
                <Grid container spacing={3}>
                    {this.props.devices.map(dev => (
                        <Grid item xs={12} sm={6} md={3} key={dev._id}>
                            <Link
                                to={{
                                    pathname: "/device/" + dev.identifier
                                }}
                                style={{ textDecoration: "none" }}
                            >
                                <Paper style={{ padding: "10px" }}>
                                    <div style={{textAlign: "center"}}>
                                        <Typography variant="h6">{dev.identifier}</Typography><br/>
                                        <Typography>Room: {dev.room.name}</Typography><br/>
                                        <Typography>{dev.room.description}</Typography>
                                    </div>
                                </Paper>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </div>
        );
    }

}

export default DeviceList;