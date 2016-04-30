'use strict';

let authenticate = require(`${__dirname}/../lib/authenticate`);

module.exports = function(router, models) {
  let Player = models.Player;
  let Team = models.Team;

  router.route('/players')
  .get((req, res) => {
    Player.find({}, (err, players) => {
      res.json({
        status: true,
        players: players
      });
      res.end();
    });
  })
  .post(authenticate, (req, res) => {
    let userStatus = req.decodedToken;

    if (userStatus.admin || userStatus.manager && userStatus.team === req.body.current_team) {
      Player.findOne({alias: req.body.alias})
      .then(player => {
        if (player) {
          return res.json({
            status: 'failure',
            message: 'player already exists'
          });
        }

        var newPlayer = new Player(req.body);
        newPlayer.save((err, player) => {
          if (err) return console.log(err);
          Team.update({name: player.current_team}, {$push: {current_members: player._id}}, (err, data) => {
            if (err) return console.log(err);
            res.json({
              status: true,
              player: player,
              message: `${player.alias} added`
            });
          });
        });
      })
      .catch(err => res.send(err));

    } else {

      res.status(400).json({
        message: 'You do not have the authorization to perform this action.'
      });
      res.end();
    }
  });

  router.route('/players/:id')
  .get((req, res) => {
    Player.findOne({alias: req.params.player}, (err, player) => {
      if (err) return res.send(err);
      res.json({
        status: true,
        data: player
      });
      res.end();
    });
  })
  .put(authenticate, (req, res) => {
    let userStatus = req.decodedToken;

    Player.findOne({_id: req.params.id})
    .then(player => {
      if (userStatus.admin || userStatus.manager && userStatus.team === player.current_team) {
        // check to see if the request is to change teams
        if (req.body.current_team && req.body.current_team !== player.current_team) {
          var teamLeave;
          // get the player's current team and the team they're switching to
          Team.findOne({name: req.body.current_team}, (err, teamJoin) => {
            if (player.current_team) {
              Team.findOne({name: player.current_team}, (err, team) => {
                if (err) console.log(err, 'this is first error');
                teamLeave = team;
                return teamJoin;
              });
            } else {
              return teamJoin;
            }
          })
          .then(teamJoin => {
            if (teamLeave) {
              // update the team the player is leaving, by removing them from the current members array
              Team.findByIdAndUpdate({_id: teamLeave._id},
                {$set: {
                  current_members: teamLeave.current_members.filter(member => (member.toString() !== player._id.toString()))}},
                (err, data) => {
                  if (err) return console.log(err);
                }
              );
            }
            // add player to their new team
            Team.findByIdAndUpdate(teamJoin._id,
              {$push: {current_members: player._id}},
              (err, data) => {
                if (err) return console.log(err);
              }
            );
          })
          .catch(err => console.log(err));
        }

        Player.update({_id: req.params.id}, {$set: req.body}, (err, data) => {
          if (err) return res.send(err);
          res.json({data: data, message: `${player.alias} updated`});
        });
      } else {

        res.json({
          status: 'failure',
          message: 'You do not have the authorization to perform this action.'
        });
      }
    })
    .catch(err => res.send(err));
  })
  .delete(authenticate, (req, res) => {
    let userStatus = req.decodedToken;

    if (userStatus.admin) {
      Player.findOne({_id: req.params.id}, (err, player) => {
        player.remove((err, player) => {
          res.json({message: `${player.name} removed`});
          res.end();
        });
      });

    } else {

      res.json({
        status: 'failure',
        message: 'You do not have the authorization to perform this action.'
      });
      res.end();
    }
  });
}
