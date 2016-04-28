'use strict';

module.exports = (ContRouter, Continent, User, auth)=>{

  ContRouter.get('/continents', auth, (req, res)=>{
    Continent.find({}, (err, continent)=>{
      res.json({id: continent});
    });
  });

  ContRouter.get('/continents/:id',auth, (req, res)=>{
    var query = {_id: req.params.id};
    Continent.findOne(query, (err, continent)=>{
      res.json({id: continent});
    });
  });

  //*****************************************
  //populating gem data inside of continent
  //*****************************************
  ContRouter.get('/populate/:id', auth,(req, res)=>{
    var query = {_id: req.params.id};
    Continent.findOne(query).populate('gems').exec((err, continent)=>{
      res.json({id: continent});
    });
  });

  ContRouter.post('/continents',auth, (req, res)=>{
    var newContinent = new Continent(req.body);
    newContinent.save((err, continent)=>{
      res.json(continent);
      res.end();
    });
  });

  ContRouter.put('/continents/:id',auth, (req, res)=>{
    var query = { _id: req.params.id};
    Continent.update(query, req.body, (err, continent)=>{
      res.json({id: continent});
      res.end();
    });
  });

  ContRouter.delete('/continents/:id', auth,(req, res)=>{
    var query = {_id: req.params.id};
    Continent.remove(query, (err)=>{
      console.log('This is hit : ' + err);
      res.json({msg: 'requested continent has been removed.'});
    });
  });

};
