const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Usuario = require('./models/usuario');

require('./db');

const routes = require('./routes/routes');
app.use('/api', routes);

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let users = [];
let idCounter = 0;

// app.post('/api/users', function (req, res) {
//   let newUser = { _id: ++idCounter, username: req.body.username };
//   users.push(newUser);
//   return res.json(newUser);

// })

app.post('/api/users', async (req, res) => {
  const user = new Usuario({
    username: req.body.username,
  })
  try {
    const userToSave = await user.save();
    res.status(200).json({ username: user.username, _id: user._id });
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

//exports.UsuarioModel = Usuario;