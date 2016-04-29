'use strict';
var express = require('express');
var app = express();
var router = require('./router.js');
var router2 = require('./router2.js');
// var bodyParser = require('body-parser');

let mongoose = require('mongoose');
let DB_PORT = process.env.MONGOLAB_URI || 'mongodb://localhost/test';
mongoose.connect(DB_PORT);

// app.use(bodyParser);
app.use(router);
app.use(router2);

app.listen(3000, ()=>{
  console.log('Port 3000 is listening..');

});
