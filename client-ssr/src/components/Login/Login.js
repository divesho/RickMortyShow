import React, { Component } from 'react';
import { Login, Register, ForgotPassword } from './Forms';
import axios from 'axios';
import { withCookies } from 'react-cookie';

import CONFIG from './../../config';

class LoginPage extends Component {

    constructor(props) {

        super(props);

        let stateValues = this.defaultStateValues();
        stateValues.formFlags.login = true;
        
        this.state = {...stateValues}
    }

    defaultStateValues = () => {
        return {
            loginUsername: '',
            loginPassword: '',
            forgotUsername: '',
            username: '',
            password: '',
            errorMessage: '',
            successMsg: '',
            formFlags: {
                login: false,
                register: false,
                forgotPassword: false
            }
        };
    }

    handleChange = (e) => {

        let key = e.target.id;
        let value = e.target.value;

        let newState = {...this.state};

        newState[key] = value;

        this.setState({...newState, formFlags: {...newState.formFlags}});
    }

    handlePageChange = (e, page, successMsg) => {

        if(e) e.preventDefault();

        let stateValues = this.defaultStateValues();
        stateValues.formFlags[page] = true;

        if(successMsg) {
            stateValues.successMsg = successMsg;
        }

        this.setState({ ...stateValues, formFlags: {...stateValues.formFlags} });

        setTimeout(()=>{
            this.setState({successMsg: ""});
        }, 2000);
    }

    submitLogin = (e) => {

        let loginUsername = this.state.loginUsername;
        let loginPassword = this.state.loginPassword;

        if(!loginUsername || !loginPassword) {

            return this.setState({errorMessage: CONFIG.messages.enterDetails});
        }

        let url = CONFIG.apiUrl + 'login';
        let data = { uname: loginUsername, password: loginPassword };

        this.setState({errorMessage: "", successMsg: ""});

        axios.post(url, data)
        .then(result => {

            const { cookies } = this.props;
            const options = { maxAge: CONFIG.cookie.maxAge, path: CONFIG.cookie.path };

            cookies.set(CONFIG.cookie.tokenName, result.data.jwtToken, options);
            cookies.set(CONFIG.cookie.userPref, result.data.preferences, options);

            this.props.history.push("/");
        })
        .catch((err) => {

            if(err.response && err.response.data && err.response.data.error) {
                return this.setState({errorMessage: err.response.data.error});
            }

            return this.setState({errorMessage: CONFIG.messages.unknownError});
        });
    }

    submitForgotPassword = (e) => {

        let forgotUsername = this.state.forgotUsername;

        if(!forgotUsername) {
            return this.setState({errorMessage: CONFIG.messages.enterDetails});
        }

        // Depelopment under progress!
    }

    submitRegister = (e) => {

        let username = this.state.username;
        let password = this.state.password;

        if(!username || !password) {
            this.setState({errorMessage: CONFIG.messages.enterDetails});
            return;
        }

        let url = CONFIG.apiUrl + 'register';
        let data = { uname: username, password: password };

        this.setState({errorMessage: "", successMsg: ""});

        axios.post(url, data)
        .then(result => {

            console.log("RESULT:::::::", result);
            
            this.handlePageChange(null, 'login', CONFIG.messages.regstrationSuccess);
        })
        .catch((err) => {

            console.log("err:::::::", err);

            if(err.response && err.response.data && err.response.data.error) {
                return this.setState({errorMessage: err.response.data.error});
            }

            this.setState({errorMessage: CONFIG.messages.unknownError});
        });
    }

    render() {

        return (
            <>
                {this.state.formFlags.login ? 
                    <Login 
                        handleChange={this.handleChange}
                        handleClick={this.submitLogin}
                        handlePageChange={this.handlePageChange}
                        errorMessage={this.state.errorMessage}
                        successMsg={this.state.successMsg} /> 
                    :
                    this.state.formFlags.register ? 
                        <Register 
                            handleChange={this.handleChange}
                            handleClick={this.submitRegister}
                            handlePageChange={this.handlePageChange}
                            errorMessage={this.state.errorMessage}
                            successMsg={this.state.successMsg} />
                        : 
                        <ForgotPassword 
                            handleChange={this.handleChange}
                            handleClick={this.submitForgotPassword}
                            handlePageChange={this.handlePageChange}
                            errorMessage={this.state.errorMessage}
                            successMsg={this.state.successMsg} />}
            </>
        )
    }
}

export default withCookies(LoginPage);