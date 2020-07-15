import React from 'react';
import { Header } from './Header.js';
import { Main } from './Main';
import { TOKEN_KEY } from '../constants.js';

import '../styles/App.css';
import '../styles/Login.css';
import '../styles/Header.css';
import '../styles/Home.css';
import '../styles/AroundMarker.css';

class App extends React.Component {
    state = {
        // if already logged in, localStorage will have TOKEN_KEY stored
        // !!, first convert to a boolean type, then mark it opposite
        isLoggedIn: !!localStorage.getItem(TOKEN_KEY),
    }

    loginHandler = (response) => {
        localStorage.setItem(TOKEN_KEY, response);
        this.setState({ isLoggedIn: true });
    }

    logoutHandler = () => {
        localStorage.removeItem(TOKEN_KEY);
        this.setState({ isLoggedIn: false });
    }

    render() {
        return (
            <div className="App">
                <Header isLoggedIn={this.state.isLoggedIn} logoutHandler={this.logoutHandler}/>
                <Main isLoggedIn={this.state.isLoggedIn} loginHandler={this.loginHandler}/>
            </div>
        );
    }
}

export default App;
