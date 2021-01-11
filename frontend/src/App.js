import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import PrivateApp from './PrivateApp';
import PublicApp from './PublicApp';
import { requestWhoami, requestLogout } from './services/authServices';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
		requestWhoami((result) => {
			this.setState({
				user: result.user
			})
		});
	}

    handleLogin(user) {
		this.setState({
			user: user
		})
    }
    
    updateUser(user) {
        this.setState({
            user: user
        })
    }

    handleLogout() {
        requestLogout((res) => {
			this.setState({
				user: null
			});
		})
    }

    render() {
        return (
            <Router>
                {
                    this.state.user
                        ?
                        <Switch>
                            <Route path="/">
                                <PrivateApp 
                                    user={this.state.user}
                                    updateUser={this.updateUser}
                                    handleLogout={this.handleLogout}
                                />                                
                            </Route>
                        </Switch>
                        :
                        <Switch>
                            <Route path="/">
                                <PublicApp
                                    notifyLogin={this.handleLogin}
                                />
                            </Route>
                        </Switch>
                }
            </Router>
        );
    }

}

export default App;
