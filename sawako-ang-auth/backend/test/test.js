'use strict';
process.env.MONGOLAB_URI = 'mongodb://localhost/notes_test';
require('./../server');

var mongoose = require('mongoose');
var chai = require('chai');
var chaiHTTP = require('chai-http');
chai.use(chaiHTTP);

var request = chai.request;
var expect = chai.expect;

var Gem = require(__dirname + '/../models/gem_model');


describe('Integration Testing, to see if the Gems routes are working', ()=>{
  var id;
  before((done)=>{
    request('localhost:3000')
    .post('/register')
    .auth('user', 'password')
    .end(done());
  });
  before((done)=>{
    request('localhost:3000')
    .post('/login')
    .auth('user', 'password')
    .end(done());
  });
  before((done)=>{
    var newGem = new Gem({name: 'Sapphire', color: 'blue'});
    newGem.save((err, gem)=>{
      if(err){
        return console.log('Here is test post error : ' + err);
      }
      id = gem._id;
      console.log('newgem : ' + gem);
      done();
    });
  });
  after((done)=>{
    console.log('hitting dropDatabase');
    mongoose.connection.db.dropDatabase(()=>{
      done();
    });
  });

  it('should take /gems as route',(done)=>{
    request('localhost:3000')
    .get('/gems')
    .send({token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmY0MDc1ZWJhOTcwYzFlMGVkNTMzNTYiLCJpYXQiOjE0NTg4MzM1NzN9.c8O_-Cx5eI-uwnwLGDviPiyjoK4JMa1GXtaHBAj-KhI'})
    .end((err, res)=>{
      expect(err).to.be.null;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('name');
      done();
    });
  });

  it('should take a /gems/:id route', (done)=>{
    console.log('is this test hitting?');
    request('localhost:3000')
    .get('/gems/' + id)
    .send({token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmY0MDc1ZWJhOTcwYzFlMGVkNTMzNTYiLCJpYXQiOjE0NTg4MzM1NzN9.c8O_-Cx5eI-uwnwLGDviPiyjoK4JMa1GXtaHBAj-KhI'})
    .end((err, res)=>{
      expect(err).to.be.null;
      expect(res.body).to.have.an('object');
      expect(res.body).to.have.property('_id');
      expect(res.body._id).to.eql('_id:'+ id);
      done();
    });
  });
});
