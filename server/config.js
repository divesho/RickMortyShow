module.exports = {
    "port": "8081",
    "db": {
        "host": process.env.MONGO_URI,
        "port": "27017",
        "user": "",
        "password": "",
        "db": "rickMortyShow"
    },
    "bcrypt": {
        "salt": 10
    },
    "jwt": {
        "secret": "$eCrEtK6y",
        "expiresIn": 3600
    },
    "apiUrl": "https://rickandmortyapi.com/api/character/"
};