const dbSchema = require('./../db/schema');
const axios = require('axios');
const CONFIG = require('./../config.json');

const fetchAndInsert = () => {

    axios.get(CONFIG.apiUrl)
    .then((res) => {

        let dataArr = [];

        if(res.data) {
            
            let results = res.data.results;
            dataArr = results.map(data => {
                data.episode ? delete data.episode : '';
                return data;
            });
        }
        
        return dataArr;
    })
    .then(arr => {

        if(arr.length < 1) {
            return;
        }
        
        let TVShows = dbSchema.TVShows;
        return TVShows.insertMany(arr);
    })
    .then(data => {

        console.log("---> DB Data after insert: ", data);
    })
    .catch(err => {

        console.log('fetchAndInsert error', err);
    });
}

module.exports = () => {

    let TVShows = dbSchema.TVShows;

    TVShows.findOne({})
    .then(res => {

        if(res) {

            console.log('Already Saved');
            return;
        }
        
        fetchAndInsert();
    })
    .catch((error) => {

        console.log("Init API error", error);
    });
}