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
   passwordHash: String
});

var User = mongoose.model("User", userSchema);

describe('API Routing Tests', () => {
  before( function(done) {
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
    done();
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

    it("Check that a session has been granted", (done) => {
      // done();
      // done();
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

    data = {
      email:"ugmo04@hotmail.com"
    }
    it("Fails on invalid user details", (done) => {
      var request = chai.request(LOCALHOST);
      request.post('/signup')
        .send(data)
        .end((err, res) => {
          assert.equal(res.body.message, "Invalid details.");
          assert.equal(res.body.success, false);
          done();
        });
    })
  })
})
