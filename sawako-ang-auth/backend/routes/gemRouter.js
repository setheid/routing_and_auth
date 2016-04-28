'use strict';

module.exports = (GemRouter ,Gem ,User ,auth)=>{

  GemRouter.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).send('Somthing broke');
    next();
  });

  GemRouter.use((req, res, next)=>{
    console.log('Time : ' + new Date());
    // res.json(new Date());
    next();
  });

  GemRouter.get('/gems',auth , (req, res)=>{
    Gem.find({}, (err,gem)=>{
      if(err){
        res.json({msg: 'Oops, there is an error.' + err});
      }
      res.json(gem);
    });
  });

  GemRouter.get('/gems/:id',auth, (req, res)=>{
    Gem.findById(req.params.id, (err, gem)=>{
      res.json(gem);
    });
  });

  //**************************
  //querying density Number
  //**************************
  GemRouter.get('/density/', auth,(req, res)=>{
    var num = JSON.parse(req.query.density);
    Gem.find({'density': {$lte: num }}, (err, gem)=>{
      res.json(gem);
      res.end();
    });
  });

  GemRouter.post('/gems', auth,(req, res)=>{
    var newGem = new Gem(req.body);
    newGem.save((err, gem)=>{
      res.json(gem);
    });
  });


  GemRouter.put('/gems/:id',auth, (req, res)=>{
    var query = {_id: req.params.id };
    Gem.update(query, req.body, (err, gem)=>{
      res.json({_id: gem});
    });
  });


  GemRouter.delete('/gems/:id',auth ,(req, res)=>{
    var query = {_id: req.params.id };
    Gem.remove(query, ()=>{
      res.json({msg: 'Requested object has been removed from db.'});
    });
  });

};
