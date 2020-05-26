import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import _ from 'lodash';

import { Grid, AppBar, Toolbar, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Card from './CardList';
import Filter from './Filter';
import Toolbox from './ToolBox';
import SimpleDialog from './SimpleDialog';

import CONFIG from './../../config.json';

import axios from 'axios';


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

    let SORTTYPE = 'asc';
    if(cookies.userPreferences && cookies.userPreferences.sort) {
        SORTTYPE = cookies.userPreferences.sort;
    }

    const [ showCharacters, setShowCharacters ] = useState([]);
    const [ filterOptions, setFilterOptions ] = useState({filters: {}, checkedFilters: {}, filterData: {}});
    const [ searchValue, setSearchValue ] = useState('');
    const [ sortValue, setSortValue ] = useState(SORTTYPE);
    const [ progress, setProgress ] = useState(false);
    const [ dialog, setDialog ] = useState({open: false, msg: "", type: ''});
    const [debouncedCallApi] = useState(() => _.debounce(getFilteredCharacters, CONFIG.debounceTime));

    function logout() {

        removeCookie('jwtToken', '');
        removeCookie('userPreferences', '');
        props.history.push("/");
    }

    function formatFilterOptions(data) {

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

        setFilterOptions({
            filters: _.cloneDeep(filters),
            checkedFilters: {...checkedFilters},
            filterData: {}
        });
    }

    function openDialog(msg, type) {
        setDialog({
            open: true,
            msg: msg,
            type: type
        });
    }

    function getInitData() {

        let url = CONFIG.apiUrl + 'initData';
        let headers = {headers: {Authorization: cookies.jwtToken}};

        axios.get(url, headers)
        .then(res=>{

            if(res && res.data) {

                let characters = _.orderBy(res.data.characters, ['id'], [SORTTYPE]);

                formatFilterOptions(_.cloneDeep(res.data.filters));
                setShowCharacters(_.cloneDeep(characters))
            } else {
                openDialog(CONFIG.messages.unknownError, "error");
            }
        })
        .catch(err=>{
            
            if(err.response && err.response.data && err.response.data.error) {
                openDialog(CONFIG.messages.sessionExpiry, "error");
                setTimeout(()=> {
                    props.history.push('/login');
                }, 2000);
            } else {
                openDialog(CONFIG.messages.unknownError, "error");
            }
        });
    }

    React.useEffect(()=>{

        getInitData();
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
                debouncedCallApi(value, sortValue, filterData);
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
        let headers = {headers: {Authorization: cookies.jwtToken}};
        
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