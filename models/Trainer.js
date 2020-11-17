const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const trainerSchema = new Schema({
  name: {type: String},
  age: {type: Number},
  email: {type: String},
  password: {type: String},
  team: {type: Array},
  captured: {type: Array}
});

const Trainer = mongoose.model('Trainer', trainerSchema)

module.exports = Trainer