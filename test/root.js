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
    // TODO: clear datbase
    done();
  })

  describe('POST /signup', () => {
    var data = {
      email:"ugmo04@hotmail.com",
      password: "Password1"
    }

    it("Should create a new user and grant a session", (done) => {
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
        assert(response.length, 1);

        done();
      })
      // done();
    })

    it("Check that a session has been granted", (done) => {
      // done();
    })
  })
})
