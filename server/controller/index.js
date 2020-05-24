const dbSchema = require('./../db/schema');
const CONFIG = require('./../config.json');

const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = (uname, password) => {

    password = bcrypt.hashSync(password, CONFIG.bcrypt.salt);

    let User = new dbSchema.Users({uname, password, preferences: {"sort": "asc"}});

    return User.save()
    .then(result => {
        
        return {id: result['_id']};
    })
    .catch(error => {

        console.log("DB Error:", error.message);

        if(error.message.indexOf("duplicate key") > -1) {
            return {"error": "user name already exists", "code": 400};
        }

        return {"error": error.message, "code": 500};
    });
};

const login = (uname, password) => {

    let User = dbSchema.Users;

    return User.findOne({uname})
    .then(result => {

        if(!result) {

            return {"error": "user name is incorrect", "code": 400};
        }

        if(!bcrypt.compareSync(password, result.password)) {

            return {"error": "password is incorrect", "code": 400};
        }

        let jwtToken = jwt.sign(
            { data: result._id }, 
            CONFIG.jwt.secret, 
            { expiresIn: CONFIG.jwt.expiresIn }
        );
        
        return {
            _id: result._id,
            uname: result.uname,
            preferences: result.preferences,
            jwtToken
        };
    })
    .catch(error => {

        console.log("DB Error:", error.message);
        return {"error": error.message, "code": 500};
    });
};

const filters = () => {

    let TVShows = dbSchema.TVShows;

    let speciesAggr = [{$group: {_id: "$species"}},{$project: {_id: 0, name: "$_id"}}];
    let originAggr = [{$group: {_id: "$origin.name"}},{$project: {_id: 0, name: "$_id"}}];
    let genderAggr = [{$group: {_id: "$gender"}},{$project: {_id: 0, name: "$_id"}}];

    let promises = [
                        TVShows.aggregate(speciesAggr), 
                        TVShows.aggregate(originAggr), 
                        TVShows.aggregate(genderAggr)
                    ];

    return Promise.all(promises)
    .then(res => {
        
        let species = res[0].map(obj => obj.name);
        let origin = res[1].map(obj => obj.name);
        let gender = res[2].map(obj => obj.name);

        return { species, origin, gender };
    })
    .catch(err => {
        
        console.log('--> err: ', err);
        return {"error": error.message, "code": 500};
    });
}

const showCharacter = () => {

    let TVShows = dbSchema.TVShows;

    return TVShows.find()
    .then(res => {

        if(!res) {
            return [];
        }

        return res;
    })
    .catch(err => {
        
        console.log('--> err: ', err);
        return {"error": error.message, "code": 500};
    });
}

const initData = () => {

    let promises = [filters(), showCharacter()];

    return Promise.all(promises)
    .then(res => {
        
        if(!res) return {};

        return { filters: res[0] || {}, characters: res[1] || [] };
    })
    .catch(err => {
        
        console.log('--> err: ', err);
        return {"error": error.message, "code": 500};
    });
}

const getFilteredCharacters = (filterOptions) => {

    let TVShows = dbSchema.TVShows;

    let filterObj = {};
    let sortType = 1;
    let filters = filterOptions.filters;

    if(filterOptions.searchValue) {
        let regePattern = new RegExp(filterOptions.searchValue, 'i')
        filterObj.name = { $regex: regePattern }
    }

    if(filterOptions.sortValue) {
        sortType = filterOptions.sortValue === "asc" ? 1 : -1;
    }

    // FORMAT: { type: { value: label } }
    if(filters && !_.isEmpty(filters)) {
        if(filters.species && !_.isEmpty(filters.species)) {
            filterObj.species = { '$in': _.values(filters.species)}
        }
        if(filters.origin && !_.isEmpty(filters.origin)) {
            filterObj['origin.name'] = { '$in': _.values(filters.origin)}
        }
        if(filters.gender && !_.isEmpty(filters.gender)) {
            filterObj.gender = { '$in': _.values(filters.gender)}
        }
    }

    return TVShows.find(filterObj).sort({id: sortType})
    .then(res => {
        if(!res) {
            return [];
        }

        return res;
    })
    .catch(err => {
        
        console.log('--> err: ', err);
        return {"error": error.message, "code": 500};
    });
}

const updateSortType = (jwtToken, sortValue) => {

    let Users = dbSchema.Users;

    let jwtData = jwt.verify(jwtToken, CONFIG.jwt.secret);

    return Users.findOneAndUpdate(
        {_id: jwtData.data}, 
        {'preferences.sort': sortValue}, 
        {new: true}
    )
    .then(res => {
        
        return "Updated successfully";
    })
    .catch(err => {

        console.log('updateSortType ERROR: ', err);
    });
}

module.exports = {
    register,
    login,
    filters,
    showCharacter,
    initData,
    getFilteredCharacters,
    updateSortType
}