import React from 'react';
import ResponsiveDrawer from './elements/ResponsiveDrawer';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import AccountPage from './pages/AccountPage';
import DevicePage from './pages/DevicePage';

class PrivateApp extends React.Component {

    constructor(props) {
        super(props);

        this.getAppContent = this.getAppContent.bind(this);
    }

    getAppContent() {
        return (
            <Switch>
                <Route exact path="/account">
                    <AccountPage 

                    />                    
                </Route>
                <Route path="/device/:id" component={() => 
                    <DevicePage
                        user={this.props.user}
                        updateUser={this.props.updateUser}
                    />
                }>                    
                </Route>
                <Route path="/">
                    <HomePage 
                        user={this.props.user}
                    />
                </Route>
            </Switch>
        );
    }

    render() {
        return (
            <ResponsiveDrawer
                appContent={this.getAppContent()} 
                onLogout={this.props.handleLogout}/>
        );
    }

}

export default PrivateApp;