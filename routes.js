var express = require('express');
var bodyParser = require('body-parser');
var server = require('./config/server.js');
// var multer = require('multer');
// var cookieParser = require('cookie-parser');
// var upload = multer();

var app = express();

// Middleware
// app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
