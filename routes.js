var express = require('express');
var bodyParser = require('body-parser');
var server = require('./config/server.js');

var app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Assign root to root router
var root = require('./routes/root.js');
app.route("/signup").post(root.postSignup);
app.route("/login").post(root.postLogin);

//Assign user router to user router
var users = require('./routes/users.js');
app.route('/user/claims').post(users.postClaims);
app.route('/user/make-claim').post(users.postMakeClaim);

// Set up port and server
app.listen(server.port, () => {
  console.log("API listening on port " + server.port);
});
