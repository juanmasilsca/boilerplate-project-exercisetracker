const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const logSchema = new Schema({
  username: String,
  count: Number,
  log: [{}]
})

module.exports = mongoose.model('Log', logSchema);