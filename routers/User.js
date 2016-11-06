var cloudant = require('cloudant');
var express = require('express');

var router = express.Router();
var cnf =  JSON.parse(process.env.VCAP_SERVICES);
var connection = cloudant({account: cnf.cloudantNoSQLDB[0].credentials.username, password: cnf.cloudantNoSQLDB[0].credentials.password});

var IsAuthenticated = require('../middleware/AuthenticationCheck');

//register endpoint
router.post('/register', (req, res) => {
    var mTest = connection.db.use('users');
    mTest.insert({name: req.body.name, mail: req.body.email, password: req.body.password}, (err, body, header) => {
        if(err){
            res.json({status: failes, reason: err});
            return;
        }
        else {
            res.json({status: "success", doc: body});
            return;
        }
    });
});

//function that creates authentication token
function createToken(len){
    var charSet = "abcdefghijklmnoprstuvyzABCDEFGHIJKLMNOPRSTUVYZ123456789-=+";
    var charsetLength = charSet.length;
    var i = 0;

    var token = "";
    while( i < len ) {
        token += charSet.charAt(Math.floor(Math.random() * charsetLength))
        i++;
    } 

    return token;
};

//login endpoint
//req.body.email: user's email address
//req.body.password user's password
router.post('/login', (req, res) => {
    var mail = req.body.email;
    var password = req.body.password;

    var db = connection.db.use('users');
    db.find({selector: {mail: mail, password: password}}, (err, result) => {
        if(err) {
            res.json({status: "failed", reason: err});
            return;
        } 
        //if user found then create a token, save it and send as a response
        else {
            var cacheClient = require('../config/DataCacheClient');
            var token = createToken(64);
            
            cacheClient.put(result.docs[0]._id.toString(), {item: token})
            .then( (resp) => {
                res.json({status: "success", id: result.docs[0]._id, token: token});
                return;
            })
            .catch((err) => {
                res.json({status: "failed", reason: err});
                return;
            });
        }
    });
});


//Middleware test to check if it works correctly
router.post('/logintest', IsAuthenticated, function(req, res) {
    res.json({status: "success"});
    return;
});

module.exports = router;
