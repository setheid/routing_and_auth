'use strict'
let Animal = require(__dirname + '/../models/animals_model');

module.exports = (apiRouter) => {
  apiRouter.route('/animals')
    .post((req, res) => {
      var newAnimal = new Animal(req.body);
      newAnimal.save((err, animal) => {
        res.json({
          status: 200,
          data: animal
        })
      })
    })
    .get((req, res) => {
      Animal.find({}, (err, animal) => {
        res.json({
          status: 200,
          data: animal
        })
      })
    })

  apiRouter.route('/animals/:id')
    .get((req, res) => {
      Animal.findById(req.params.id, (err, animal) => {
        res.json({
          status: 200,
          data: animal
        })
      })
    })
    .put((req, res) => {
      Animal.update({_id: req.params.id}, req.body, (err, animal) => {
        res.json({
          status: 200,
          data: req.body
        })
      })

    })
    .delete((req, res) => {
      Animal.findByIdAndRemove(req.params.id, (err, animal) => {
        res.json({
          status: 200,
          message: 'animal removed'
        })
      })
    })

    apiRouter.route('/mostPopularAnimalFood')
      .get((req, res) => {
        var foodArray = [];
        Animal.find({}, (err, animal) => {
          animal.forEach((animal) => {
            foodArray.push(animal.favoriteFood);
          })
          //gets the most popular food with the count
          var count = {};
          var mostFood;
          for(var i = 0; i < foodArray.length; i++) {
            count[foodArray[i]] = count[foodArray[i]] + 1 || 1;
            if(count[foodArray[i]] > (count[mostFood] || 0)) {
              mostFood = foodArray[i];
            }
          }
          res.json({
            status: 200,
            message: 'The most popular food for animals is, \'' + mostFood + '\' with ' + count[mostFood] + ' tallies'
          })
          res.end();
        })
    })
}
