require('express')().use(require('express').static('build'))
  .listen('8080', ()=>console.log('Cli-server listening at 8080.. yay!'));
