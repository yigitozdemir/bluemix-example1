/*eslint-env node*/

var express = require('express');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
// create a new express server
var app = express();
//load body parser and set it to the application
var bodyParser = require('body-parser');
//we are going to communicate through json
app.use(bodyParser.json({extended: true}));
//load cloudant
var cloudant = require('cloudant');

// serve the files out of ./public as our main files
//app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

app.get('/', (req, res) => {
    var cnf = JSON.parse(process.env.VCAP_SERVICES);
    console.log(cnf);
    res.send(cnf.cloudantNoSQLDB[0].credentials.username);
    return;
});

//load routers
var userRouter = require('./routers/User');

app.use('/user', userRouter);

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});


