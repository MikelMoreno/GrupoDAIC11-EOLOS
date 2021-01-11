import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import DeviceList from '../elements/DeviceList';

class HomePage extends React.Component {

    constructor(props) {
        super(props);


    }

    render() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <div>
                        <Typography variant="h5">Welcome back</Typography><br />
                        <Typography variant="subtitle1">{this.props.user.email}</Typography>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <DeviceList 
                        devices={this.props.user.devices}
                    />
                </Grid>
            </Grid>
        );
    }

}

export default HomePage;
