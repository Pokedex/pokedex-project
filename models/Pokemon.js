const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const pokemonSchema = new Schema({
  number: {type: Number},
  name: {type: String},
  weight: {type: Number},
  height: {type: Number},
  type: {type: String},
  trainer: {type: String},
  trainerCapture: {type: String},
  trainerTeam: {type: String}
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

module.exports = Pokemon;