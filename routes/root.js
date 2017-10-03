var mongoose = require('mongoose');
var User = require('../models/users.js');
var crypto = require('crypto');

// Allows user to create new login details with
// email and password hash
function postSignup(req, res) {
  console.log("POST /signup")
  // Check that data is valid
  //TODO: data object validation for security
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
          if (err) {
            res.json({
              message:"Failed to generate salt.",
              success:false,
            })
          } else {
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
                res.json({
                  message:"New user created.",
                  success:true,
                  email:req.body.email,
                })
              }
            })
          }

        });
      }
    })
  }
}

// Allows user to login in using previously
// created email and password hash
function postLogin(req, res) {
  console.log("POST /login");
  // Check that data is valid
  //TODO: data object validation for security
  if (!req.body.email || !req.body.password) {
    res.json({
      message:"Invalid details.",
      success:false
    });
  } else {
    // Check that user does already exist
    User.find({email:req.body.email}, (err, response) => {
      if(response.length != 1) {
        res.json({
          message:"Email does not exist.",
          success:false
        })
      } else {
        // Get hashedPassword
        var mySalt = response[0].salt;
        var passwordWithSalt = req.body.password + mySalt;
        const hash = crypto.createHash('sha256');
        hash.update(passwordWithSalt);
        var hashedPassword = hash.digest('hex');

        // Compare to database value
        if(hashedPassword == response[0].passwordHash) {
          res.json({
            message:"Logged In.",
            success:true,
            email:req.body.email,
          })
        } else {
          res.json({
            message:"Not logged In.",
            success:false,
          })
        }
      }
    })
  }
}

// module.exports = router;
module.exports = { postSignup, postLogin };
