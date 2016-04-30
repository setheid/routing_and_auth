'use strict';

let authenticate = require(`${__dirname}/../lib/authenticate`);

module.exports = function(router, models) {
  let Player = models.Player;
  let Team = models.Team;

  router.route('/teams')
  .get((req, res) => {
    Team.find({}, (err, teams) => {
      res.json({
        status: true,
        teams: teams
      });
    });
  })
  .post((req, res) => { // removed authenticate middleware
    let userStatus = req.decodedToken;

    Team.findOne({name: req.body.name})
    .then(team => {
      if (team) {
        return res.json({
          status: 'failure',
          message: 'team already exists'
        });
      }

      // if (userStatus.admin) {
        var newTeam = new Team(req.body);
        newTeam.save((err, team) => {
          if (err) return console.log(err);
          res.json({
            status: true,
            team: team,
            message: `${req.body.name} added.`
          });
        });

      // } else {
      //
      //   res.json({
      //     status: 'failure',
      //     message: 'You do not have the authorization to perform this action.'
      //   });
      // }
    })
    .catch(err => res.send(err));
  });

  router.route('/teams/:id')
  .get((req, res) => {
    Team.findOne({_id: req.params.id})
    .populate('current_members')
    .exec()
    .then(team => {
      res.json({
        status: true,
        data: team
      });
    })
    .catch(err => res.send(err));
  })
  .put((req, res) => { // removed 'authenticate' middleware
    // let userStatus = req.decodedToken;
    // if (userStatus.admin || userStatus.manager && userStatus.team === req.params.team) {
      Team.update({team: req.params.team}, {$set: req.body}, (err, team) => {
        if (err) return res.send(err);
        res.json({data: team});
      });

    // } else {
    //
    //   res.json({
    //     status: 'failure',
    //     msg: 'You do not have the authorization to perform this action.'
    //   });
    // }
  })
  .delete((req, res) => { // removed authenticate middleware
    let userStatus = req.decodedToken;
    // if (userStatus.admin) {
      Team.findOne({_id: req.params.id})
      .then((team) => {
        console.log(team);
        let counter = 0;
        if (team.current_members[0]) {
          team.current_members.forEach((player) => {
              console.log(player);
              Player.findByIdAndUpdate(player.toString(), {$set: {current_team: null}}, (err, player) => {
                counter++;
                console.log(counter);
                console.log(player.name + ' is no longer on a team.');
                if (counter === team.current_members.length) {
                  team.remove((err, team) => {
                    res.json({message: `${team.name} removed`})
                    console.log('team removed');
                  });
                }
              });
          });
        } else {
          team.remove((err, team) => {
            res.json({message: `${team.name} removed`})
            console.log('team removed');
          });
        }
      });

    // } else {
    //
    //   res.json({
    //     status: 'failure',
    //     message: 'You do not have the authorization to perform this action.'
    //   });
    //   res.end();
    // }
  });
}
