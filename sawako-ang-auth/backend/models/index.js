'use strict';


let models = {};
require('./gem_model.js')(mongoose, models);
require('./continent_model.js')(mongoose, models);

module.exports = models;
