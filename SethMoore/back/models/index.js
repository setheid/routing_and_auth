'use strict';

let mongoose = require('mongoose'),
  config = require(`${__dirname}/../config`);

mongoose.connect(process.env.MONGOLAB_URI || config.database);

let models = {};

require('./team')(mongoose, models);
require('./player')(mongoose, models);
require('./user')(mongoose, models);

module.exports = models;
