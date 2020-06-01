const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');

const DBInitCall = require('./db/init');
const CONFIG = require('./config');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use('/', routes);

app.listen(CONFIG.port, ()=>{

    console.log("Server listening at ", CONFIG.port);
});

mongoose.connect(
    `${CONFIG.db.host}${CONFIG.db.db}`,
    {useFindAndModify: false}
)
.then(()=> {
    
    DBInitCall();
})
.catch(err => {
    
    console.log("--> Error: ", err);
});