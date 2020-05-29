import React from 'react';

import { Typography, Chip, Select, MenuItem, TextField, InputAdornment } from '@material-ui/core';
import { Search } from '@material-ui/icons';

import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';

const styles = makeStyles((theme)=>({
    root: {
        margin: '0 5px',
        padding: '0 5px',
        backgroundColor: theme.palette.background.paper
    },
    selectedFilters: {
        marginBottom: '1rem'
    },
    searchField: {
        width: '10rem'
    },
    toolbox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    sorting: {
        padding: '0 0.5rem',
        width: '10rem',
    },
    chip: {
        margin: '0rem 0.5rem 0.5rem 0rem'
    },
    '@media screen and (min-width: 900px)': {
        
    },
    '@media screen and (max-width: 599px)': {
        root: {
            padding: '0rem',
            margin: '0rem'
        },
        toolbox: {
            flexDirection: 'column'
        },
        searchField: {
            marginBottom: '1rem',
            width: '100%'
        },
        sorting: {
            width: '100%'
        }
    }
}));

export default function ToolBox(props) {

    const classes = styles();

    return (
        <div className={classes.root}>
            <div className={classes.selectedFilters}>
                <Typography>Selcted Filters</Typography>
                <br />
                {_.map(props.filterData, (obj, type) => {
                    return _.map(obj, (label, value) => {
                        
                        return <Chip 
                                    className={classes.chip} 
                                    key={value} 
                                    label={label} 
                                    onDelete={()=>props.handleDelete(type, label, value, false)} 
                                />
                    })
                })}
            </div>
            <div className={classes.toolbox}>
                <div>
                    <TextField
                        id="searchField"
                        className={classes.searchField}
                        placeholder="search"
                        onChange={props.handleChange}
                        value={props.searchValue}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                <div>
                    <Select 
                        className={classes.sorting} 
                        onChange={(e)=>props.handleChange(e, 'sortField')} 
                        value={props.sortValue} 
                        id="sortField" 
                    >
                        <MenuItem value="asc">Ascending</MenuItem>
                        <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                </div>
            </div>
        </div>
    )
}
