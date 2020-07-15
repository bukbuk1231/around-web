import React from 'react';
import PropTypes from 'prop-types';
import { Home } from '../components/Home.js';
import { Register } from './Register';
import { Login } from '../components/Login';
import { Switch, Route, Redirect } from 'react-router-dom';

export class Main extends React.Component {
    static propTypes = {
        isLoggedIn: PropTypes.bool.isRequired,
    }
    getLogin = () => {
        return this.props.isLoggedIn ? <Redirect to = "/home" /> : /*access from App.js*/<Login loginHandler={this.props.loginHandler}/>
    }
    getHome = () => {
        return this.props.isLoggedIn ? <Home/> : <Redirect to = "/login"/>
    }
    getRoot = () => {
        return <Redirect to="/login"/>
    }
    render() {
        return (
            <div className="main">
                <Switch>
                    [exact here so that won't be affected by other path]
                    <Route exact path="/" render={this.getRoot}/>
                    <Route path="/register" component={Register}/>
                    <Route path="/login" render={this.getLogin}/>
                    <Route path="/home" render={this.getHome}/>
                    <Route render={this.getRoot}/>
                </Switch>
            </div>
        );
    }
}
