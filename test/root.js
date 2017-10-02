var assert = require('assert');
var mongoose = require('mongoose');
var chai = require('chai');
var chaiHttp = require('chai-http');
var configDb = require('../config/db.js');

var assert = chai.assert;
var should = chai.should();
chai.use(chaiHttp);

describe('API Routing Tests', () => {
  before( function(done) {
    mongoose.connect(configDb.mongodb);
    done();
  })
  describe('GET /', () => {
    it("Should return the complete set of movies", (done) => {
      // var request = chai.request(config.server.url);
      // request.get('/movies').end((err, res) => {
      //   res.should.have.status(200);
      //   res.body.should.be.a('array');
      //   res.body.length.should.be.eql(4);
      //   done();
      // });
    })
  })
})
