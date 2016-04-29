'use strict'
let People = require(__dirname + '/../models/people_model');
let jwtAuth = require(__dirname + '/../lib/authenticate');

module.exports = (apiRouter) => {
  apiRouter.route('/people', jwtAuth)
    .get((req, res) => {
      People.find({}, (err, people) => {
        res.json({
          status: 200,
          data: people
        })
      })
    })
    .post((req, res) => {
      var newPerson = new People(req.body);
      newPerson.save((err, person) => {
        res.json({
          status: 200,
          data: person
        })
      })
    })

  apiRouter.route('/people/:id')
    .get((req, res) => {
      People.findById(req.params.id, (err, person) => {
        res.json({
          status: 200,
          data: person
        })
      })
    })
    .put((req, res) => {
      People.update({_id: req.params.id}, req.body, (err, person) => {
        res.json({
          status: 200,
          data: req.body
        })
      })
    })
    .delete((req, res) => {
      People.findByIdAndRemove(req.params.id, (err, person) => {
        res.json({
          status: 200,
          message: 'person removed'
        })
      })
    })

    apiRouter.route('/mostPopularPeopleFood')
    .get((req, res) => {
      var foodArray = [];
      People.find({}, (err, person) => {
        person.forEach((person) => {
          foodArray.push(person.favoriteFood);
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
        res.json({message: 'The most popular food for people is, \'' + mostFood + '\' with ' + count[mostFood] + ' tallies'});
        return res.end();
      })
    })
}
