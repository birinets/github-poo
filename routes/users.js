var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/users.js');
var server = require('../config/server.js');
var crypto = require('crypto');
var https = require('https');
var urlModule = require('url');
var nodemailer = require('nodemailer');

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
      if(response.length == 0) {
        res.json({
          message:"Email does not exists.",
          success:false
        })
      } else {
        User.find({email:req.body.email, 'claims.url':req.body.url}, (err, response) => {
          if(response.length == 0) {
            // The repository has not been claimed by this user
            crypto.randomBytes(32/2, (err, buff) => {
              if (err) {
                res.json({
                  message:"Failed to generate hash.",
                  success:false,
                })
              } else {
                // Generate hash
                var myHash = buff.toString("hex");
                // Store the new claim in the database
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
                    var transporter = nodemailer.createTransport(server.email);
                    var mailOptions = {
                      from: server.email.auth.user,
                      to: req.body.email,
                      subject: 'Add this file to get Proof of Ownership of ' + req.body.url,
                      text: 'Please add a file with name "' + myHash + '.txt" to the /proofs/ folder in the ' + req.body.url + " repository to get Proof of Ownership."
                    };
                    transporter.sendMail(mailOptions, function(err, info){
                      if (err) {
                        console.log(err);
                        res.json({
                          message:"New repository claim made but email was not delivered.",
                          success:true,
                          hash:myHash,
                        })
                      } else {
                        console.log('Email sent: ' + info.response);
                        res.json({
                          message:"New repository claim made and email was sent.",
                          success:true,
                          hash:myHash,
                        })
                      }
                    });

                  }
                })
              }
            })
          } else {
            // The reposity is already in the process of being claimed
            // Check if the file sent by email exists in folder /proofs/
            var myClaim = response[0].claims[0];
            var hash = myClaim.hash;
            var myUrl = urlModule.parse(myClaim.url, true);
            var myPath = myUrl.path + "blob/master/proofs/" + myClaim.hash + ".txt";
            https.request({
              method:"HEAD",
              host:myUrl.host,
              path:myPath,
            }, (response) => {
              if(response.statusCode == 200) {
                // File was found in repository!
                User.update({email:req.body.email, 'claims.url':req.body.url}, {'claims':{verified:true}}, (err, response) => {
                  if (err) {
                    res.json({
                      message:"Database error.",
                      success:false
                    })
                  } else {
                    res.json({
                      message:"Repository was successfully verified.",
                      success:true,
                    })
                  }
                })
              } else {
                // File was not found in repository
                res.json({
                  message:"Repository was not verified.",
                  success:false,
                })
              }
            }).end();
          }
        })
      }

    })
  }
})

module.exports = router;
