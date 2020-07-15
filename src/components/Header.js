import React from "react";
import logo from '../assets/images/logo.svg';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

// export so that App.js could import from Header.js file
export class Header extends React.Component {
    // insure isLoggedIn and handle
    static propTypes = {
        isLoggedIn: PropTypes.bool.isRequired,
        logoutHandler: PropTypes.func.isRequired,
    }
    render() {
        return (
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Around</h1>
                {
                    this.props.isLoggedIn ?
                        <a href=""
                           className="logout"
                           onClick={this.props.logoutHandler}
                        >
                            <Icon type="logout" />{' '}Logout
                        </a>
                        : null
                }
            </header>
        );
    }
}