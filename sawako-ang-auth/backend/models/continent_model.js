'use strict';
const mongoose = require('mongoose');
const ContinentSchema = new mongoose.Schema({
  country: String,
  region: String,
  mineral: String,
  gems: 
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gem'
  }
});

let Continent = mongoose.model('Continent', ContinentSchema);
module.exports = Continent;
