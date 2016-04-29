'use strict'
const mongoose = require('mongoose');
const animalSchema = new mongoose.Schema({
  name: String,
  favoriteFood: String,
  age: Number
})

module.exports = mongoose.model('Animal', animalSchema)
