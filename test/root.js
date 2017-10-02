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

describe('API Routing Tests', () => {
  before( function(done) {
    mongoose.connect(configDb.mongodb);
    done();
  })

  describe('POST /signup', () => {
    it("Should ...", (done) => {
      var data = {
        email:"ugmo04@hotmail.com",
        passwordHash: "aheaah"
      }
      var request = chai.request(LOCALHOST);
      request.post('/signup')
        .send(data)
        .end((err, res) => {
          assert.equal(res.body.message, "New user created");
          assert.equal(res.body.location, "/movies/105");
          done();
        });
    })
  })
})
