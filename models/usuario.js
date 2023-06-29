const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  username: { type: String, required: true },
  log: [{}]
})

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;