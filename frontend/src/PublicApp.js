import { AppBar, Typography } from '@material-ui/core';
import React from 'react';
import LoginPage from './pages/LoginPage';
import { requestLogin } from './services/authServices';

class PublicApp extends React.Component {

    constructor(props) {
        super(props);


        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(email, password) {
        requestLogin(email, password, (res) => {
            if (!res.error) {
                return this.props.notifyLogin(res);
            }

            alert("Invalid credentials")
        });
    }

    render() {
        return (
            <div>
                <AppBar>
                    <div
                        style={{padding: "15px", textAlign: "center"}}
                    >
                        <Typography variant="h4">Project Eolos</Typography>
                    </div>
                </AppBar><br/>
                <LoginPage
                    onLogin={this.handleLogin} 
                />
            </div>
        );
    }

}

export default PublicApp;