import React from 'react';
import moment from 'moment';

import { Grid, Card, CardMedia, CardContent, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme)=>({
    thumbnailContainer: {
        width: '100%',
        marginTop: '1rem',
        backgroundColor: theme.palette.background.paper,
    },
    thumbnail: {
        height: 'auto',
        margin: '5px',
        padding: '5px'
    },
    media: {
        height: '12rem'
    },
    mediaTitle: {
        background: 'gray',
        color: '#fff',
        top: '9rem',
        position: 'relative',
        height: '2rem',
        opacity: '.8',
        padding: '0.5rem',
        fontSize: '12px',
        '& .smallText': {
            paddingTop: '0.2rem',
            fontSize: '8px'
        }
    },
    cardContent: {
        padding: "0rem !important"
    },
    tabs: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '0.5rem',
        fontSize: '11px',
        background: '#e5e0e0',
        borderTop: '0.1px solid #d3cfcf',
        ':nth-child(1)': {
            borderTop: 'none'
        },
        '& .left': {
            maxWidth: '4rem',
            paddingRight: '2px',
            textTransform: 'uppercase'
        },
        '& .right': {
            textAlign: 'right',
            color: '#3f51b5',
            wordBreak: 'break-all'
        }
    },
    '@media screen and (min-width: 900px)': {
        thumbnail: {
            '& .smallText': {
                fontSize: '10px'
            }
        }
    },
    '@media screen and (max-width: 600px)': {
        thumbnailContainer: {
            padding: '0rem',
            margin: '0rem'
        }
    }
}));

function CardContentTabs(props) {
    
    const classes = styles();

    return (
            <div className={classes.tabs}>
                <div className="left">{props.label}</div>
                <div className="right">{props.name}</div>
            </div>
    );
}

export function CardItem(props) {
    
    const classes = styles();
    const character = props.character;
    const cardContentKeys = ['status', 'species', 'gender', 'origin', 'location'];
    const formattedTime = moment(character.created).fromNow();

    return (
        <Card className={classes.thumbnail}>

            <CardMedia className={classes.media} image={character.image}>
                <div className={classes.mediaTitle}>
                    <div>{character.name}</div>
                    <div className="smallText">id: {character.id} - created {formattedTime}</div>
                </div>
            </CardMedia>
            <CardContent className={classes.cardContent}>
                {cardContentKeys.map((contentkey, i) => {

                    let label = contentkey;
                    let name = character[contentkey];

                    if(contentkey === "origin") {
                        name = character.origin.name;
                    }

                    if(contentkey === "location") {
                        label = 'last location';
                        name = character.location.name;
                    }

                    return <CardContentTabs key={i} label={label} name={name} />
                })}
            </CardContent>
        </Card>
    )
}

export default function CardList(props) {

    const classes = styles();

    return (
        <Grid container  className={classes.thumbnailContainer}>
            {props.progress ? 
                <Grid container justify="center">
                    <CircularProgress />
                </Grid>
                :
                props.characters.length > 0 ? 
                    props.characters.map(character => {
                        return <Grid item key={character.id} xs={6} sm={3} lg={3}><CardItem character={character} /></Grid>
                    })
                    :
                    <Grid container justify="center">
                        <Typography variant="h5">No Data Found</Typography>
                    </Grid>
            }
        </Grid>
    )
}