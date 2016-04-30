'use strict';

module.exports = function(mongoose, models) {
  let teamsSchema = new mongoose.Schema({
    name: String,
    active: { type: Boolean, default: true },
    region: String,
    current_members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
      }
    ]
    // past_members: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Player'
    //   }
    // ]
  });

  let Team = mongoose.model('Team', teamsSchema);
  models.Team = Team;
}
