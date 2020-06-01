const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const controller = require('./controller');
const CONFIG = require('./config');

const checkAuth = (req, res, next) => {

    if(req.headers.authorization) {
        jwt.verify(req.headers.authorization, CONFIG.jwt.secret, (err, result) => {
            if(err) {
                
                // message: invalid token, name: JsonWebTokenError
                // message: jwt expired, name: TokenExpiredError
                res.status(401).send({error: err.message})
            } else {
                next();
            }
        });
    } else {

        res.status(401).send({error: "JWT token is required"});
    }
}

router.post("/login", (req, res) => {

    let uname = req.body.uname;
    let password = req.body.password;

    if(!uname || !password) {

        return res.status(400).send("user name and password required");
    }

    controller.login(uname, password)
    .then(result => {

        if(result && result.error) {
            throw result;
        }

        res.send(result);
    })
    .catch(err => {

        console.log("Error: ", err);
        res.status(err.code).send({error: err.error});
    })
});

router.post("/register", (req, res) => {

    let uname = req.body.uname;
    let password = req.body.password;

    if(!uname || !password) {

        return res.status(400).send("user name and password required");
    }

    controller.register(uname, password)
    .then(result => {

        if(result && result.error) {
            throw result;
        }

        res.status(200).send(result);
    })
    .catch(err => {

        console.log("Error: ", err);
        res.status(err.code).send({error: err.error});
    });
});

router.get("/filters", (req, res) => {

    controller.filters()
    .then(result => {

        if(result && result.error) {
            throw result;
        }

        res.status(200).send(result);
    })
    .catch(err => {

        console.log("Error: ", err);
        res.status(err.code).send({error: err.error});
    });
});

router.get("/showCharacter", checkAuth, (req, res) => {

    controller.showCharacter()
    .then(result => {

        if(result && result.error) {
            throw result;
        }

        res.status(200).send(result);
    })
    .catch(err => {

        console.log("Error: ", err);
        res.status(err.code).send({error: err.error});
    });
})

router.get("/initData", checkAuth, (req, res) => {

    controller.initData()
    .then(result => {

        if(result && result.error) {
            throw result;
        }

        res.status(200).send(result);
    })
    .catch(err => {

        console.log("Error: ", err);
        res.status(err.code).send({error: err.error});
    });
})

router.post("/characters/filters", checkAuth, (req, res) => {

    let filterOptions = req.body;

    controller.getFilteredCharacters(filterOptions)
    .then(result => {

        if(result && result.error) {
            throw result;
        }

        controller.updateSortType(req.headers.authorization, filterOptions.sortValue);
        res.status(200).send(result);
    })
    .catch(err => {

        console.log("Error: ", err);
        res.status(err.code).send({error: err.error});
    });
});

module.exports = router;