'use strict';
let chai = require('chai');
let chaiHTTP = require('chai-http');
chai.use(chaiHTTP);

let request = chai.request;
let expect = chai.expect;
let mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/test';
let Continent = require('./../models/continent_model');
let Gem = require('./../models/gem_model');
require('./../server');
var token = '';
var id;
var idGem;

describe('/register route integration test', function (){

  it('should send back a new user',function (done){
    request('localhost:3000')
    .post('/register')
    .auth('newunser', 'pass123')
    .end(function(err, res){
      expect(err).to.be.a('null');
      expect(res.body).to.have.property('name');
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('password');
      done();
    });
  });
  it('should spit back an error when try to save the existing user and pass',function(done){
    request('localhost:3000')
    .post('/register')
    .auth('newunser', 'pass123')
    .end(function(err, res){
      expect(res).to.have.status(418);
      done();
    });
  });
});

describe('authentication /login rout integration test', function (){
  it('should send back a string of token', function(done){
    request('localhost:3000')
    .post('/login')
    .auth('newunser', 'pass123')
    .end(function(err, res){
      token = res.body.token;
      console.log('TOKEN TOKEN : ' + token);
      expect(err).to.be.a('null');
      expect(res.body).to.have.property('token');
      expect(res.body.token).to.have.a('string');
      done();
    });
  });
});

describe('routes should pass auth middleware and autherize it via rsc routes', function(){
  before((done)=>{
    var newContinent = new Continent({country: 'Japan', region: 'Osaka'});
    var newGem = new Gem({name: 'Ruby', color: 'red', density: 4});
    newContinent.save(function(err, continent){
      if(err){
        return console.log('Here is test post CONTINENT error : ' + err);
      }
      id = continent._id;
      console.log('newContinent : ' + continent);
    });
    newGem.save(function(err, gem){
      if(err){
        return console.log('Here is test post GEM error : ' + err);
      }
      idGem = gem._id;
      console.log('newGem : ' + gem);
      done();
    });
  });
  after(function(done){
    console.log('dropping database here!!!!');
    mongoose.connection.db.dropDatabase();
    done();
  });
  it('should get 401 status back if decoded a token that is not part of this db', function(done){
    request('localhost:3000')
    .get('/continents')
    .set({'token': 'djfhakljfhkajdfhakejg'})
    .end((err, res)=>{
      expect(err).to.have.status(401);
      expect(res).to.be.an('object');
      done();
    });
  });
  it('should get all continents data when GET /continents is hit', function(done){
    request('localhost:3000')
    .get('/continents')
    .send({token: token})
    .end((err, res)=>{
      it('should get 401 status back if decoded a token that is not part of this db', function(done){
        request('localhost:3000')
        .get('/continents')
        .set({'token': token})
        .end((err, res)=>{
          expect(err).to.be.null;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('i');
          done();
        });
      });
      expect(res).to.be.an('object');
      done();
    });
  });
  it('should grab only one data that is being specified by end point', function(done){
    request('localhost:3000')
    .get('/continents/' + id)
    .set({'token': token})
    .end((err, res)=>{
      expect(res).to.be.an('object');
      expect(res.body).to.have.property('id');
      done();
    });
  });
  it('should grab one continent and PUT gem id', function(done){
    request('localhost:3000')
    .put('/continents/' + id)
    .set({'token': token})
    .send({gems: idGem})
    .end((err, res)=>{
      expect(res).to.be.an('object');
      Continent.findOne({_id: id}, function(err, continent){
        expect(continent).to.have.property('id');
        expect(continent).to.have.property('gems');
        done();
      });
    });
  });
  it('should grab only one continent data and populate gems field', function(done){
    request('localhost:3000')
    .get('/populate/' + id)
    .set({'token': token})
    .end((err, res)=>{
      expect(err).to.be.null;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('id');
      expect(res.body.id.gems).to.have.property('color');
      done();
    });
  });
  it('should POST a new continent data', function(done){
    request('localhost:3000')
    .post('/continents')
    .set({'token': token})
    .send({country: 'Korea', region: 'Seoul'})
    .end((err, res)=>{
      expect(err).to.be.null;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('country');
      expect(res.body).to.have.property('region');
      done();
    });
  });
  it('should grab only one continent data and remove it from db', function(done){
    request('localhost:3000')
    .delete('/continents/' + id)
    .set({'token': token})
    .end((err, res)=>{
      expect(err).to.be.null;
      expect(res.body).to.be.an('object');
      expect(res.body._id).to.be.undefined;
      done();
    });
  });
  it('should grab all gems data', function(done){
    request('localhost:3000')
    .get('/gems')
    .set({'token': token})
    .end((err, res)=>{
      expect(err).to.be.null;
      expect(res).to.be.an('object');
      expect(res.body).to.be.an('array');
      done();
    });
  });
  it('should get gem by id', function(done){
    request('localhost:3000')
    .get('/gems/' + idGem)
    .set({'token': token})
    .end((err, res)=>{
      expect(err).to.be.null;
      expect(res).to.be.an('object');
      expect(res.body).to.have.property('name','Ruby');
      done();
    });
  });
  it('should get only a density data less than the user specified num', function(done){
    request('localhost:3000')
    .get('/density/')
    .query({density: 5})
    .set({'token': token})
    .end((err, res)=>{
      expect(err).to.be.null;
      expect(res).to.be.an('object');
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('density', 4);
      done();
    });
  });
  it('should POST a new Gem data', function(done){
    request('localhost:3000')
    .post('/gems')
    .set({'token': token})
    .send({name: 'Diamond', color: 'transparent', density: 5})
    .end((err, res)=>{
      expect(err).to.be.null;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('name');
      expect(res.body).to.have.property('color', 'transparent');
      done();
    });
  });
  it('should grab one Gem and PUT a new gem data', function(done){
    request('localhost:3000')
    .put('/gems/' + idGem)
    .set({'token': token})
    .send({color: 'various red'})
    .end((err, res)=>{
      expect(res).to.be.an('object');
      Gem.findOne({_id: idGem}, function(err, gem){
        expect(gem).to.have.property('id');
        expect(gem).to.have.property('name', 'Ruby');
        expect(gem).to.have.property('color', 'various red');
        done();
      });
    });
  });
  it('should grab only one Gem data and remove it from db', function(done){
    request('localhost:3000')
    .delete('/gems/' + idGem)
    .set({'token': token})
    .end((err, res)=>{
      expect(err).to.be.null;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('msg');
      done();
    });
  });
});
