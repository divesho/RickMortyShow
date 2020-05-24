import React from 'react';
import { Dialog, Typography } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme)=>({
    content: {
        padding: '2rem'
    },
    success: {
        color: 'green'
    },
    error: {
        color: 'red'
    },
    '@media screen and (min-width: 900px)': {
        
    },
    '@media screen and (max-width: 599px)': {
        
    }
}));

export default function SimpleDialog(props) {

    const classes = styles();

    return (
        <Dialog open={props.open}>
            <div className={classes.content +" "+ (classes[props.type] || '')}>
                <Typography>{props.msg}</Typography>
            </div>
        </Dialog>
    )
}
