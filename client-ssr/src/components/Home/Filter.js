import React from 'react';

import { Grid, FormGroup, FormControlLabel, Typography, Checkbox, IconButton } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';

const styles = makeStyles((theme)=>({
    root: {

    },
    gridItem: {
        padding: '0.3rem',
        marginTop: '1rem',
        border: '1px solid rgba(0,0,0,0.2)',
        '& .label': {
            fontSize: '12px',
            wordBreak: 'break-all'
        }
    },
    formControlLabel: {
        marginRight: '0'
    },
    filterTitle: {
        textTransform: 'capitalize'
    },
    hideInDesktop: {
        display: 'none'
    },
    hideInMobile: {
        display: 'block'
    },
    '@media screen and (min-width: 900px)': {
        gridItem: {
            padding: '0.5rem'
        }
    },
    '@media screen and (max-width: 599px)': {
        gridItem: {
            padding: '0.5rem'
        },
        hideInDesktop: {
            display: 'block'
        },
        hideInMobile: {
            display: 'none'
        }
    }
}));

function FilterParameter(props) {

    const classes = styles();

    let filterType = props.filterType.toString().toLowerCase();
    let label = props.label;
    let value = props.value;

    return (<FormControlLabel
                className={classes.formControlLabel}
                control={
                    <Checkbox
                        size="small"
                        onChange={(e)=>props.handleChange(filterType, label, value, e.target.checked)}
                        value={value}
                        color="primary"
                        checked={props.checked}
                    />
                }
                label={<span className="label" >{label}</span>} 
            />);
}

function FilterBar(props) {

    const classes = styles();

    return (<Grid container direction="column">
                {_.map(props.filters, (filter, title) => {
                    return (
                        <Grid item  className={classes.gridItem} key={title}>
                            <Typography className={classes.filterTitle}>{title}</Typography>
                            <FormGroup>
                                {_.map(filter, (label, value)=>{
                                    return (
                                        <FilterParameter key={value} 
                                            checked={props.checkedFilters[title+"_"+value]}
                                            filterType={title} 
                                            label={label}
                                            value={value}
                                            handleChange={props.handleChange} />
                                    )
                                })}
                            </FormGroup>
                        </Grid>
                    )
                })}
            </Grid>);
}

export default function Filter(props) {

    const classes = styles();

    const [ filterToggle, setFilterToggle ] = React.useState('more');

    function handleToggle() {

        if(filterToggle === 'less') {
            setFilterToggle('more');
        } else {
            setFilterToggle('less');
        }
    }

    return (
        <>
            <div className={classes.hideInDesktop}>
                <Grid container direction="row" justify="space-between">
                    <Grid item style={{paddingTop: '0.5rem'}}>Filters</Grid>
                    <Grid item className={classes.hideInDesktop}>
                        {filterToggle === 'less' ? 
                            <IconButton size="small" onClick={handleToggle}><ExpandLess  /></IconButton>
                            :
                            <IconButton size="small" onClick={handleToggle}><ExpandMore  /></IconButton>
                        }
                    </Grid>
                </Grid>
                {filterToggle === 'less' && <FilterBar {...props} />}
            </div>
            <div className={classes.hideInMobile}>
                <Grid container direction="row" justify="space-between">
                    <Grid item style={{paddingTop: '0.5rem'}}>Filters</Grid>
                </Grid>
                <FilterBar {...props} />
            </div>
        </>
    )
}
