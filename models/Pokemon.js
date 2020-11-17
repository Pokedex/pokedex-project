const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const pokemonSchema = new Schema({
  number: {type: String},
  name: {type: String},
  weight: {type: Number},
  height: {type: Number},
  type: {type: String},
  team: {type: Array},
  moves: {type: [String]},
  spotted: {type: Boolean},
  captured: {type: Boolean}
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema)

module.exports = Pokemon