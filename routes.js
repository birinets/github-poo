var express = require('express');
var bodyParser = require('body-parser');
var server = require('./config/server.js');
// var multer = require('multer');
// var upload = multer();
var session = require('express-session');
// var cookieParser = require('cookie-parser');

var app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(session({secret: server.key}));

//Assign router to root url
var root = require('./routes/root.js');
app.use('/', root);

//Assign user router to root url
var users = require('./routes/users.js');
app.use('/user', users);

// Set up port and server
app.listen(server.port, () => {
  console.log("API listening on port " + server.port);
});
