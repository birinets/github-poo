var assert = require('assert');
var mongoose = require('mongoose');
var chai = require('chai');
var chaiHttp = require('chai-http');
var configDb = require('../config/db.js');
var server = require('../config/server.js');

var assert = chai.assert;
var should = chai.should();
chai.use(chaiHttp);

const LOCALHOST = 'http://localhost:' + server.port;

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

var User = mongoose.model("User", userSchema);

describe('API Routing Tests', () => {
  before( function(done) {
    // Connect to and whipe database
    mongoose.connect(configDb.test);
    User.find({}).remove().exec();

    User.find({}, (err, response) => {
      if(err) console.log(err);
      if(response.length == 0) {
        console.log("Database users collection cleared.");
      } else {
        console.log("Database users collection was NOT cleared!");
        console.log(response);
      }
    })

    // Create user that can be verified that file exists in repository
    var newUser = new User({
      email: "jack.n.c.tanner@gmail.com",
    	salt: "3ca1aaba4c9cc6536a7dee95838f6cbf",
    	passwordHash: "03fa7318e34dc7a270839f6e85e43ea8063f7be13a09a91e13e6dc9361dcc6b2",
      // corresponds to password: "Password1"
    	claims: [{
    			hash: "c0041d390018c8b68edacc0a79ff4002",
    			verified: false,
    			url: "https://github.com/ugmo04/github-poo/"
    		}]
    })
    newUser.save( (err) => {
      if (err) throw err;
      done();
    });
  })

  describe('POST /signup', () => {
    var data = {
      email:"ugmo04@hotmail.com",
      password: "Password1"
    }
    it("Should create a new user", (done) => {
      var request = chai.request(LOCALHOST);
      request.post('/signup')
        .send(data)
        .end((err, res) => {
          assert.equal(res.body.message, "New user created.");
          assert.equal(res.body.success, true);
          assert.equal(res.body.email, data.email);
          done();
        });
    })

    it("Check that user was added to database", (done) => {
      User.find({email:data.email}, (err, response) => {
        assert.equal(response.length, 1);
        assert.equal(response[0].email, data.email);
        assert.equal(response[0].salt.length, 32);
        assert.equal(response[0].passwordHash.length, 64);

        done();
      })
    })

    it("Cannot create a user again with the same email", (done) => {
      var request = chai.request(LOCALHOST);
      request.post('/signup')
        .send(data)
        .end((err, res) => {
          assert.equal(res.body.message, "Email already exists.");
          assert.equal(res.body.success, false);
          done();
        });
    })

    var data2 = {
      email:"ugmo04@hotmail.com"
    }
    it("Fails on invalid user details", (done) => {
      var request = chai.request(LOCALHOST);
      request.post('/signup')
        .send(data2)
        .end((err, res) => {
          assert.equal(res.body.message, "Invalid details.");
          assert.equal(res.body.success, false);
          done();
        });
    })
  })

  describe('POST /user/claims', () => {
    var data = {
      email:"ugmo04@hotmail.com",
    }

    it("User initially has 0 claims", (done) => {
      var request = chai.request(LOCALHOST);
      request.post('/user/claims')
        .send(data)
        .end((err, res) => {
          assert.equal(res.body.length, 0);
          done();
        });
    })
  })

  describe('POST /user/make-claim', () => {
    var data = {
      email:"ugmo04@hotmail.com",
      url: "https://github.com/ugmo04/github-poo/",
    }
    it("User can make a claim to a new repository", (done) => {
      var request = chai.request(LOCALHOST);
      request.post('/user/make-claim')
        .send(data)
        .end((err, res) => {
          assert.equal(res.body.message, "New repository claim made.");
          assert.equal(res.body.success, true);
          assert.equal(res.body.hash.length, 32);
          done();
        })
    })

    it("User tries to make a claim to reposity which does not have hash file.", (done) => {
      var request = chai.request(LOCALHOST);
      request.post('/user/make-claim')
        .send(data)
        .end((err, res) => {
          assert.equal(res.body.message, "Repository was not verified.");
          assert.equal(res.body.success, false);
          done();
        })
    })

    var data2 = {
      email:"jack.n.c.tanner@gmail.com",
      url: "https://github.com/ugmo04/github-poo/",
    }
    it("User tries to make a claim to reposity which does have hash file.", (done) => {
      var request = chai.request(LOCALHOST);
      request.post('/user/make-claim')
        .send(data2)
        .end((err, res) => {
          assert.equal(res.body.message, "Repository was successfully verified.");
          assert.equal(res.body.success, true);
          done();
        })
    })

  })

  // describe('POST /login', () => {
  //   var data = {
  //     email:"ugmo04@hotmail.com",
  //     password: "Password1"
  //   }
  //
  //   it("Should log in as ugmo04@hotmail.com user", (done) => {
  //     var request = chai.request(LOCALHOST);
  //     request.post('/login')
  //       .send(data)
  //       .end((err, res) => {
  //         assert.equal(res.body.message, "Logged In.");
  //         assert.equal(res.body.success, true);
  //         assert.equal(res.body.email, data.email);
  //         done();
  //       });
  //   })
  // })
})
