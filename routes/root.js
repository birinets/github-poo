var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var configDb = require('../config/db.js');
var crypto = require('crypto');

mongoose.connect(configDb.test);

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
  console.log(req.session);
  console.log("id: " + req.session.id);
  // Check that data is valid
  if (!req.body.email || !req.body.password) {
    res.json({
      message:"Invalid details.",
      success:false
    });
  } else {
    // Check that user does not already exist
    User.find({email:req.body.email}, (err, response) => {
      if(response.length > 0) {
        res.json({
          message:"Email already exists.",
          success:false
        })
      } else {
        // Generate salt
        crypto.randomBytes(32/2, (err, buff) => {
          if (err) throw err;

          // Create password hash with salt
          var newSalt = buff.toString('hex');
          var passwordWithSalt = req.body.password + newSalt;
          const hash = crypto.createHash('sha256');
          hash.update(passwordWithSalt);
          var hashedPassword = hash.digest('hex');

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
              console.log("User " + req.body.email +" created!");
                            // Set the session for users to user at /user endpoint
              req.session.user = "session1";
              req.session.save( (err) => {
                res.send("message sent...");
                console.log(req.session);
              });
              // {
              //   email:req.body.email,
              // };
              // console.log(req.session);
              // Send back confirmation
              // res.send("Message sent back...");
              // res.json({
              //   message:"New user created.",
              //   success:true,
              //   email:req.body.email,
              // })
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
