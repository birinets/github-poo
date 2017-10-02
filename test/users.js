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
  var data = {
    email:"ugmo04@hotmail.com",
    password: "Password1"
  }

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

    var request = chai.request(LOCALHOST);
    request.post('/signup')
      .send(data)
      .end((err, res) => {
        if(err) {
          console.log(err);
        } else {
          console.log("User " + data.email + " created.")
        }
      });
    done();
  })

  describe('POST /user/claims', () => {
    it("User should be able to receive all claims", (done) => {
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
  })

})
