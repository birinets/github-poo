var express = require('express');
var bodyParser = require('body-parser');
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

// Set up port and server
var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("API listening on port " + port);
});
