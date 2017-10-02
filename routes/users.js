var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var configDb = require('../config/db.js');
var crypto = require('crypto');

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
// Fetches the list of all repository claims
// and their statuses that the user has
router.post('/claims', (req, res) => {
  console.log("POST /user/claims");
  if (!req.body.email) {
    res.json({
      message:"No user email sent.",
      success:false
    });
  } else {
    User.find({email:req.body.email}, (err, response) => {
      if(response.length == 0) {
        res.json({
          message:"Email does not exists.",
          success:false
        })
      } else {
        res.json(response.claims);
      }
    })
  }
})

// Request that an email be sent with code
// to be added to repository
router.post("/make-claim", (req, res) => {
  console.log("POST /user/make-claim");
  //TODO: data object validation for security
  if (!req.body.email || !req.body.url) {
    res.json({
      message:"Invalid details sent.",
      success:false
    });
  } else {
    User.find({email:req.body.email}, (err, response) => {
      // console.log(response);
      // console.log(response[0].claims)
      if(response.length == 0) {
        res.json({
          message:"Email does not exists.",
          success:false
        })
      } else {
        User.find({email:req.body.email, claims: {url:req.body.url}}, (err, response) => {
          if(response.length == 0) {
            // The repository has not been claimed by this user
            crypto.randomBytes(32/2, (err, buff) => {
              if (err) {
                res.json({
                  message:"Failed to generate hash.",
                  success:false,
                })
              } else {
                // Generate hash and store in database
                var myHash = buff.toString("hex");
                var newClaim = {
                  "url":req.body.url,
                  "verified":false,
                  "hash":myHash,
                }
                User.update({email:req.body.email}, {$push:{claims:newClaim}}, (err, response) => {
                  if (err) {
                    res.json({
                      message:"Database error.",
                      success:false
                    })
                  } else {
                    res.json({
                      message:"New repository claim made.",
                      success:true,
                      hash:myHash,
                    })
                  }
                })
              }
            })
          } else {
            // The reposity is already in the process of being claimed
            //TODO:verify that the repository has been added and
          }
        })
      }
    })
  }
})

// Deletes a claim of a repository
router.delete('make-claim', (req, res) => {
    console.log("DELETE /user/make-claim");
})

module.exports = router;
