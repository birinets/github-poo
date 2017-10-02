var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// Allows user to create new login details with
// email and password hash
router.post('/signup', (req, res) => {
  console.log("POST /signup");
  res.json({
    message:"stub",
    email:"stub"
  })
})

// Allows user to login in using previously
// created email and password hash
router.post("/login", (req, res) => {
  console.log("POST /login");
})

module.exports = router;
