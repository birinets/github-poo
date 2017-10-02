var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var configDb = require('../config/db.js');
var crypto = require('crypto');

mongoose.connect(configDb.test);
const hash = crypto.createHash('sha256');

var userSchema = mongoose.Schema({
   email: String,
   salt: String,
   passwordHash: String
});

var User = mongoose.model("User", userSchema);

// Allows user to create new login details with
// email and password hash
router.post('/signup', (req, res) => {
  console.log("POST /signup");
  // Check that data is valid
  if (!req.body.email || !req.body.password) {
    res.json({
      message:"Invalid details.",
      success:false
    });
  } else {
    // Check that user does not already exist
    User.find({email:req.params.email}, (err, response) => {
      if(response.length > 0) {
        res.json({
          message:"Email already exists.",
          success:false
        })
      } else {
        console.log("No user found");
        // Generate salt
        const BYTES_LENGTH = 128
        crypto.randomBytes(BYTES_LENGTH, (err, buff) => {
          if (err) throw err;

          // Create password hash with salt
          var newSalt = buff.toString('hex');
          console.log("newSalt: " + newSalt);
          var passwordWithSalt = req.body.password + newSalt;
          hash.update(passwordWithSalt);
          var hashedPassword = hash.digest('hex');
          console.log("hashedPassword: " + hashedPassword);
          
          // Add user to database with salt
          var newUser = new User({
            email:req.body.email,
            salt:newSalt,
            passwordHash:hashedPassword
          })

          newUser.save( (err, User) => {
            if(err) {
                res.json({
                message:"Database error.",
                success:false
              })
            } else {
              console.log("User created!");
              res.json({
                message:"New user created.",
                success:true,
                email:req.body.email,
              })
            }
          })
        });
      }
    })
  }
})

// Allows user to login in using previously
// created email and password hash
router.post("/login", (req, res) => {
  console.log("POST /login");
})

module.exports = router;
