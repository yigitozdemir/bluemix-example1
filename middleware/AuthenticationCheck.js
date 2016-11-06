var cacheClient = require('../config/DataCacheClient');

/**
 * Request body:
 *   user: user id
 *   token: user's authentication token
 * */
module.exports = function(req, res, next){
    var id = req.body.user;
    var token = req.body.token;
    
    cacheClient.get(id)
    .then( (doc) => {
        var fetchedToken = doc.body.item;
        //if token correct then proceed to router
        if(token == fetchedToken){
            next();
        }
        else {
            res.json({status: "failed", reason: "wrong_token"});
            return;
        }
    })
    .catch( (err) => {
        res.json({status: "failed", reason: err});
        return;
    });
};
