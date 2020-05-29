import React from 'react';

import { Grid, Paper, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme)=>({
    padTop6rem: {
        paddingTop: '6rem'
    },
    marTop1rem: {
        marginTop: '1rem'
    },
    root: {
        flexGrow: 1
    },
    paper: {
        padding: '3rem',
        textAlign: 'center',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: '700'
    },
    textField: {
        margin: '.5rem 0',
        width: '100%',
        clearFix: 'both'
    },
    btnGrp: {
        marginTop: '1rem'
    },
    buttons: {
        marginRight: "0.5rem"
    },
    links: {
        fontSize: '1rem',
        verticalAlign: 'baseline',
        textTransform: 'none',
        padding: '0',
        minWidth: 'auto'
    },
    errMsg: {
        margin: '1rem 0 0 0',
        color: '#f44336',
        fontSize: '1.1rem'
    },
    successMsg: {
        margin: '0 0 1rem 0',
        color: '#4caf50',
        fontSize: '1.1rem'
    }
}));

function Layout(props) {

    const classes = styles();

    return (
        <Grid className={classes.padTop6rem} container direction="row" justify="center" alignItems="center">
            <Grid item xs={11} sm={5}>
                <Paper className={classes.paper} elevation={2}>
                    {props.children}
                </Paper>
            </Grid>
        </Grid>
    )
}

export function Login(props) {

    const classes = styles();

    return (
        <Layout>
            <form className={classes.root} noValidate autoComplete="off" onSubmit={(e)=> e.preventDefault()}>
                <p className={classes.successMsg}>{props.successMsg}</p>
                <div className={classes.title}>Login</div>
                <TextField className={classes.textField} type="text" name="loginUsername" id="loginUsername" onChange={props.handleChange} label="User name" />
                <TextField className={classes.textField} type="password" name="loginPassword" id="loginPassword" onChange={props.handleChange} label="Password" />
                <p className={classes.errMsg} color="red">
                    {props.errorMessage}
                </p>
                <div className={classes.marTop1rem}>
                    <Grid container direction="column" justify="flex-start" alignItems="flex-start">
                        {/* <Button className={classes.links} component="button" color="primary" onClick={(e)=>{props.handlePageChange(e, 'forgotPassword')}}>Forgot password</Button> */}
                        <div className={classes.marTop1rem}>
                            <Button className={classes.buttons} type="submit" id="loginSubmitBtn" variant="contained" color="primary" onClick={props.handleClick}>Login</Button>
                            <span>New User? <Button className={classes.links} component="button" color="primary" onClick={(e)=>props.handlePageChange(e, 'register')}>register</Button> here</span>
                        </div>
                    </Grid>
                </div>
            </form>
        </Layout>
    )
}

export function ForgotPassword(props) {

    const classes = styles();

    return (
        <Layout>
            <form className={classes.root} noValidate autoComplete="off" onSubmit={(e)=> e.preventDefault()}>
                <p className={classes.successMsg}>{props.successMsg}</p>
                <div className={classes.title}>Forgot Password</div>
                <TextField className={classes.textField} type="text" name="forgotUsername" id="forgotUsername" onChange={props.handleChange} label="User name" />
                <p className={classes.errMsg} color="red">
                    {props.errorMessage}
                </p>
                <Grid className={classes.marTop1rem} container direction="row" justify="flex-start">
                    <Button className={classes.buttons} type="submit" id="forgotSubmitBtn" variant="contained" color="primary" onClick={props.handleClick}>Submit</Button>
                    <Button className={classes.buttons} id="forgotCancelBtn" color="primary" onClick={(e)=>props.handlePageChange(e, 'login')}>Cancel</Button>
                </Grid>
            </form>
        </Layout>
    )
}

export function Register(props) {

    const classes = styles();

    return (
        <Layout>
            <form className={classes.root} noValidate autoComplete="off" onSubmit={(e)=> e.preventDefault()}>
                <p className={classes.successMsg}>{props.successMsg}</p>
                <div className={classes.title}>Register</div>
                <TextField className={classes.textField} type="text" name="username" id="username" onChange={props.handleChange} label="User name" />
                <TextField className={classes.textField} type="password" name="password" id="password" onChange={props.handleChange} label="Password" />
                <p className={classes.errMsg} color="red">
                    {props.errorMessage}
                </p>
                <Grid className={classes.marTop1rem} container direction="row" justify="flex-start" alignItems="center">
                    <Button className={classes.buttons} type="submit" id="registerBtn" variant="contained" color="primary" onClick={props.handleClick}>submit</Button>
                    <span>Already have an account? <Button className={classes.links} component="button" color="primary" onClick={(e)=>props.handlePageChange(e, 'login')}>login</Button> here</span>
                </Grid>
            </form>
        </Layout>
    )
}