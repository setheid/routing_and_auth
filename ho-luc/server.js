'use strict'

let express = require('express');
let app = express();
let apiRouter = express.Router();
let mongoose = require('mongoose');
let bodyParser = require('body-parser');


require('./routes/animals-route')(apiRouter);
require('./routes/people-route')(apiRouter);
require('./routes/auth-route')(apiRouter);
require('./routes/users-route')(apiRouter);

mongoose.connect('mongodb://localhost/db')
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, token');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
  next();
})

app.use('/api', apiRouter);

app.listen(3000, () => console.log('server started on port 3000'))
