'use strict';

let config = require('../config');
process.env.MONGOLAB_URI = config.testDatabase;

let chai = require('chai');
let chaiHTTP = require('chai-http'); chai.use(chaiHTTP);
let request = chai.request;
let expect = chai.expect;
let mongoose = require('mongoose');
let models = require('../models');
let User = models.User;
let base64Decoder = require('../lib/base64Decoder');
require(__dirname + '/../server');

describe('Routes work as expected', () => {
  var managerToken;
  before((done) => {
    request('localhost:3000')
    .post('/signup')
    .send({
      username: "admin",
      password: "adminPass",
      admin: true
    })
    .end((err, res) => {
      if (err) console.log('admin', err);
    });

    request('localhost:3000')
    .post('/signup')
    .send({
      username: "manager",
      password: "managerPass",
      admin: false,
      manager: true,
      team: "testTeam"
    })
    .end((err, res) => {
      if (err) console.log('manager', err);
      done();
    });
  });

  it('should login as admin, base64Decoder should decode and parse, then receive a token', (done) => {
    request('localhost:3000')
    .post('/login')
    .auth('admin', 'adminPass')
    .end((err, res) => {
      let loginInfo = base64Decoder(res.req._headers);
      User.find({username: loginInfo[0]})
      .then(user => {
        // expect(false).eql(true);
        expect(res).to.have.status(200);
        expect(loginInfo).to.eql(['admin', 'adminPass']);
        expect(res.body).to.have.property('token');
        done();
      })
      .catch(err => console.log(err));
    });
  });

  it('should login as manager, base64Decoder should decode and parse, then receive a token', (done) => {
    request('localhost:3000')
    .post('/login')
    .auth('manager', 'managerPass')
    .end((err, res) => {
      let loginInfo = base64Decoder(res.req._headers);
      managerToken = res.body.token;
      User.find({username: loginInfo[0]})
      .then(user => {
        // expect(false).eql(true);
        expect(res).to.have.status(200);
        expect(loginInfo).to.eql(['manager', 'managerPass']);
        expect(res.body).to.have.property('token');
        done();
      })
      .catch(err => console.log(err));
    });
  });

  it('should post as manager to /teams and get a failure, unauthorized response', (done) => {
    request('localhost:3000')
    .post('/teams')
    .set('Authorization', `token ${managerToken}`)
    .send({name: 'newTeam'})
    .end((err, res) => {
      // console.log(res);
      // expect(true).eql(false);
      expect(res).to.have.status(200);
      expect(res.body.message).to.have.eql('You do not have the authorization to perform this action.');
      done();
    });
  });

  it('should post as manager to /players and get a success message', (done) => {
    request('localhost:3000')
    .post('/players')
    .set('Authorization', `token ${managerToken}`)
    .send({name: 'newPlayer', alias: 'newAlias', current_team: 'testTeam'})
    .end((err, res) => {
      // console.log(res);
      // expect(true).eql(false);
      expect(res).to.have.status(200);
      expect(res.body.message).to.have.eql('newAlias posted to players');
      done();
    });
  });
  after(() => {
    mongoose.connection.db.dropDatabase();
  });
});
