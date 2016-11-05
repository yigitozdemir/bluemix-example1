var DataCacheClient = require('datacache-client');

var cnf = JSON.parse(process.env.VCAP_SERVICES);
var dclient = new DataCacheClient({
    restResource: cnf.DataCache[0].credentials.restResource,
    restResourceSecure: cnf.DataCache[0].credentials.restResourceSecure,
    gridName: cnf.DataCache[0].credentials.gridName,
    username: cnf.DataCache[0].credentials.username,
    password: cnf.DataCache[0].credentials.password
});



module.exports = dclient;
