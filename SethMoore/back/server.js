'use strict';

let express = require('express'),
  mongoose = require('mongoose'),
  app = express(),
  publicRouter = express.Router(),
  models = require('./models');

app.use(require('body-parser').json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
  res.header('Access-Control-Allow-Headers', 'Content-Type, authorization, token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use('/', publicRouter);
require('./routes/user-routes')(publicRouter, models);
require('./routes/team-routes')(publicRouter, models);
require('./routes/player-routes')(publicRouter, models);

app.listen(3000, () => {
  console.log('server started');
});
