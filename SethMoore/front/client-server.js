'use strict';

let express = require('express');
let clientServer = express();

clientServer.use(express.static(`${__dirname}/public`)).listen(9000, (err) => {
  if (err) return console.log(err);
  console.log('client-server up on 9000');
});
