'use strict';
let mongoose = require('mongoose');

let GemsSchema = mongoose.Schema({
  name: String,
  color: String,
  density: Number,
  continent:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Continent'
  }
});

let Gem = mongoose.model('Gem', GemsSchema);
module.exports = Gem;
