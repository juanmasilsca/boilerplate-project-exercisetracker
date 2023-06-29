const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');

require('./db');

const routes = require('./routes/routes');
app.use('/api', routes);

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// const Schema = mongoose.Schema;

// const usuarioSchema = new Schema({
//   username: { type: String, required: true }
// });

// const Usuario = mongoose.model('Usuario', usuarioSchema);

// app.post('/api/users', async (req, res) => {
//   const user = new Usuario({
//     username: req.body.username
//   });
//   try {
//     const userToSave = await user.save();
//     res.json(userToSave);
//   } catch (error) {
//     res.status(400).json({message: err.message})
//   }
// })

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

//exports.UsuarioModel = Usuario;