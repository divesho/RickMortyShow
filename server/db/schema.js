const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uname: { type: String, unique: true },
    password: { type: String },
    preferences: { type: Object }
});

const TVShowSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: { type: String },
    status: { type: String },
    species: { type: String },
    type: { type: String },
    gender: { type: String },
    origin: { type: Object },
    location: { type: Object },
    image: { type: String },
    url: { type: String },
    created: { type: String }
    
});

module.exports.Users = mongoose.model('Users', UserSchema);
module.exports.TVShows = mongoose.model('ShowCharacters', TVShowSchema);