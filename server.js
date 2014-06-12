// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path     = require('path');

var configDB = require('./config/database.js');
var sessionStore = new express.session.MemoryStore();
// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

var myLogger = function(req, res, next) {
    console.log('GOT REQUEST: '+req.url);
    next();
};

app.configure(function() {

	// set up our express application
	//app.use(express.logger('dev')); // log every request to the console
	app.use(myLogger);
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session({ store: sessionStore, secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	//app.use(flash()); // use connect-flash for flash messages stored in session
        app.use(express.static(path.join(__dirname, 'angularjs')));

});

// websocket ===================================================================
var ws = require("nodejs-websocket");
var connections = {};
//var newconn = {};
// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
    console.log("New connection");
    //console.log(conn);
    conn.nickname = null;
    conn.on("text", function (str) {
        console.log("Received "+str);
        if(conn.nickname === null) {
            conn.nickname = str;
            connections[str] = conn;
            //console.log(connections);
        } else {
            var obj = JSON.parse(str);
            connections[obj.to].sendText(JSON.stringify({from: obj.from, msg: obj.msg}));
        }
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed");
    })
}).listen(8000);

// routes ======================================================================
require('./app/routes.js')(app, passport, sessionStore, server); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);


