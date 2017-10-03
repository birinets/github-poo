var mongoose = require('mongoose');
var configDb = require('../config/db.js');

// Connect to the MongoDb database
mongoose.connect(configDb.test);

// User schema definition
var userSchema = mongoose.Schema({
   email: String,
   salt: String,
   passwordHash: String,
   claims: [{
     url: String,
     verified: Boolean,
     hash: String,
   }],
});

// If the collection is not already created, create it
var Users;
try {
  User = mongoose.model('User');
} catch (error) {
  User = mongoose.model("User", userSchema);
}

module.exports = User;
