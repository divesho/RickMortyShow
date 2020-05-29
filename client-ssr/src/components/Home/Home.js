import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import _ from 'lodash';
import axios from 'axios';

import { Grid, AppBar, Toolbar, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Card from './CardList';
import Filter from './Filter';
import Toolbox from './ToolBox';
import SimpleDialog from './SimpleDialog';

import CONFIG from './../../config.json';


const styles = makeStyles((theme)=>({
    root: {
        flexGrow: 1,
    },
    mainBox: {
        padding: '0.5rem'
    },
    marTop1: {
        marginTop: theme.spacing(1)
    },
    title: {
        flexGrow: 1,
    },
    '@media screen and (min-width: 900px)': {
        mainBox: {
            padding: '1rem'
        }
    },
    '@media screen and (max-width: 599px)': {
        mainBox: {
            padding: '1rem'
        }
    }
}));

export default function Home(props) {

    const classes = styles();
    const [ cookies, setCookie, removeCookie ] = useCookies();

    let cookieData = {};
    let staticContext = props.staticContext || null;

    if(!staticContext) {
        // check for client side
        if(window.__initData__) {
            staticContext = window.__initData__;    
            delete window.__initialData__;
        }
    }

    if(staticContext && staticContext.serverCookies) {
        // server side
        cookieData = {...staticContext.serverCookies}
    } else {
        // client side
        cookieData = {...cookies};
    }

    let SORTTYPE = 'asc';
    if(cookieData.userPreferences && cookieData.userPreferences.sort) {
        SORTTYPE = cookieData.userPreferences.sort;
    }

    let defaultValues = {
        filterOptions: {filters: {}, checkedFilters: {}, filterData: {}},
        dialog: {open: false, msg: "", type: ''},
        showCharacters: []
    };

    if(staticContext && staticContext.extraProp && _.keys(staticContext.extraProp).length > 0) {

        // server side check to update default values

        if(staticContext.extraProp.sessionError) {
            
            defaultValues.dialog = {open: true, msg: CONFIG.messages.sessionExpiry, type: "error"}
            setTimeout(()=> {
                props.history.push('/login');
            }, 2000);
        } else if(staticContext.extraProp.error) {
            
            defaultValues.dialog = {open: true, msg: CONFIG.messages.unknownError, type: "error"}
        } else {

            let characters = _.orderBy(staticContext.extraProp.characters, ['id'], [SORTTYPE]);
            let tempFilters = _.cloneDeep(staticContext.extraProp.filters);
        
            defaultValues.filterOptions = formatFilterOptions(tempFilters, true);
            defaultValues.showCharacters = _.cloneDeep(characters);
        }
    }

    const [ showCharacters, setShowCharacters ] = useState(defaultValues.showCharacters);
    const [ filterOptions, setFilterOptions ] = useState(defaultValues.filterOptions);
    const [ searchValue, setSearchValue ] = useState('');
    const [ sortValue, setSortValue ] = useState(SORTTYPE);
    const [ progress, setProgress ] = useState(false);
    const [ dialog, setDialog ] = useState(defaultValues.dialog);

    function logout() {

        removeCookie('jwtToken', '');
        removeCookie('userPreferences', '');
        props.history.push("/");
    }

    function formatFilterOptions(data, returnFlag) {

        let filters = {};
        let checkedFilters = {};

        _.map(data, (arr, type) => {

            filters[type] = {};
            _.map(arr, label => {

                let value = label.toLowerCase().replace(/[ \-()]/g, '__');
                let checkedKey = type+"_"+value;
                
                filters[type][value] = label;
                checkedFilters[checkedKey] = false;
            });
        });

        let returnValue = {
                            filters: _.cloneDeep(filters),
                            checkedFilters: {...checkedFilters},
                            filterData: {}
                        };

        if(returnFlag) {
            return returnValue;
        } else {
            setFilterOptions(returnValue);
        }
    }

    function openDialog(msg, type) {
        setDialog({
            open: true,
            msg: msg,
            type: type
        });
    }

    function getInitData() {

        Home.loadInitData(cookieData.jwtToken)
        .then(result => {

            if(result.error) {
                openDialog(CONFIG.messages.unknownError, "error");
            } else if (result.sessionError) {
                openDialog(CONFIG.messages.sessionExpiry, "error");
                setTimeout(()=> {
                    props.history.push('/login');
                }, 2000);
            } else {
                let characters = _.orderBy(result.characters, ['id'], [SORTTYPE]);

                formatFilterOptions(_.cloneDeep(result.filters));
                setShowCharacters(_.cloneDeep(characters))
            }
        })
        .catch(error => {

            openDialog(CONFIG.messages.unknownError, "error");
        });
    }

    React.useEffect(()=>{

        if(showCharacters.length === 0) {
            getInitData();
        }
        
    }, []);

    function handleFilterChange(type, label, value, checked) {
        
        let newFilterOptions = _.cloneDeep(filterOptions);
        let checkedKey = type+"_"+value;

        if(checked) {

            if(!newFilterOptions.filterData[type]) newFilterOptions.filterData[type] = {};

            newFilterOptions.filterData[type][value] = label;
            newFilterOptions.checkedFilters[checkedKey] = true;
        } else {

            delete newFilterOptions.filterData[type][value];
            newFilterOptions.checkedFilters[checkedKey] = false;
        }

        setFilterOptions({..._.cloneDeep(newFilterOptions)});
        getFilteredCharacters(searchValue, sortValue, newFilterOptions.filterData);
    }

    function handleOnChange(e, eid) {

        let id = eid || e.target.id;
        let value = e.target.value;

        let filterData = _.cloneDeep(filterOptions.filterData)

        switch(id) {
            case "searchField":
                setSearchValue(value);
                getFilteredCharacters(value, sortValue, filterData);
                break;
            case "sortField":
                setSortValue(value);
                getFilteredCharacters(searchValue, value, filterData);
                break;
        }
    }

    function getFilteredCharacters(search, sort, filters) {

        setProgress(true);

        let url = CONFIG.apiUrl + 'characters/filters';
        let data = {
            searchValue: search,
            sortValue: sort,
            filters
        }
        let headers = {headers: {Authorization: cookieData.jwtToken}};
        
        axios.post(url, data, headers)
        .then(res => {
            
            if(res && res.data) {

                const options = { maxAge: CONFIG.cookie.maxAge, path: CONFIG.cookie.path };

                setShowCharacters(_.cloneDeep(res.data));
                setCookie(CONFIG.cookie.userPref, {'sort': sort}, options);
                setProgress(false);
            } else {
                openDialog(CONFIG.messages.unknownError, "error");
            }
        })
        .catch(err => {

            if(err.response && err.response.data && err.response.data.error) {
                openDialog(CONFIG.messages.sessionExpiry, "error");
                setTimeout(()=> {
                    props.history.push('/login');
                }, 2000);
            } else {
                openDialog(CONFIG.messages.unknownError, "error");
            }
        })
    }

    return (
        <>
            <SimpleDialog open={dialog.open} msg={dialog.msg} />
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            Rick Morty Show
                        </Typography>
                        <Button color="inherit" onClick={logout}>Logout</Button>
                    </Toolbar>
                </AppBar>
            </div>
            
            <Grid className={classes.marTop1} container direction="row">
                <Grid item className={classes.mainBox} xs={12} sm={2}>
                    <Filter 
                        filters={filterOptions.filters} 
                        checkedFilters={filterOptions.checkedFilters} 
                        handleChange={handleFilterChange} />
                </Grid>
                <Grid className={classes.mainBox} item xs={12} sm={10}>
                    <Toolbox 
                        handleChange={handleOnChange}
                        handleDelete={handleFilterChange}
                        filterData={filterOptions.filterData}
                        searchValue={searchValue} 
                        sortValue={sortValue} />
                    <Card characters={showCharacters} progress={progress} />
                </Grid>
            </Grid>
        </>
    )
}

Home.loadInitData = function(jwtToken) {

    let url = CONFIG.apiUrl + 'initData';
    let headers = {headers: {Authorization: jwtToken}};

    return axios.get(
                url, 
                headers
            )
            .then(res => {

                if(res && res.data) {

                    return res.data;
                } else {
                    
                    return {"error": CONFIG.messages.unknownError};
                }
            })
            .catch(err => {
                
                if(err.response && err.response.data && err.response.data.error) {
                    
                    return {"sessionError": CONFIG.messages.sessionExpiry};
                } else {
                    
                    return {"error": CONFIG.messages.unknownError};
                }
            });
}