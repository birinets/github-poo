var mongoose = require('mongoose');
var configDb = require('../config/db.js');

mongoose.connect(configDb.test);

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

var Users;
try {
  User = mongoose.model('User');
} catch (error) {
  User = mongoose.model("User", userSchema);
}

module.exports = User;
