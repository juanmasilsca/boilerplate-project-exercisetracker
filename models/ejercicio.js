const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ejercicioSchema = new Schema({
  //userId: { type: String, required: true},
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: String
})

const Ejercicio = mongoose.model('Ejercicio', ejercicioSchema);

module.exports = Ejercicio;
