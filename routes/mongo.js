var mongoose = require('mongoose');
// var configDb = require('../config/db.js');

var userSchema = mongoose.Schema({
   email: String,
   salt: String,
   passwordHash: String
});

module.export = mongoose.model("users", userSchema);
