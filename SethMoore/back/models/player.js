'use strict';

module.exports = function(mongoose, models) {
  const playersSchema = new mongoose.Schema({
    name: String,
    alias: String,
    position: Number,
    country: String,
    current_team: { type: String, default: null }
  });

  let Player = mongoose.model('Player', playersSchema);
  models.Player = Player;
}
