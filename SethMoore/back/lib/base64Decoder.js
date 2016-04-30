'use strict';

module.exports = function base64Decoder(reqHeaders) {
  let authArray = reqHeaders.authorization.split(' ');
  let method = authArray[0];
  let encodedLogin = authArray[1];
  console.log(encodedLogin);
  return new Buffer(encodedLogin, 'base64').toString().split(':');
}
