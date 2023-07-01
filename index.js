const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Usuario = require('./models/usuario');
const Ejercicio = require('./models/ejercicio');

const mongoose = require('mongoose');

require('./db');

const routes = require('./routes/routes');
app.use('/api', routes);

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const formatDate = (date) => {
  return `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}`;
}

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

app.get('/api/users', async (req, res) => {
  try {
    const users = await Usuario.find({},{__v: 0, log: 0});
    res.send(JSON.stringify(users));
    console.log(typeof users)
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

app.post('/api/users/:_id/exercises', async (req, res) => {
  const id = req.params._id;
  const date = req.body.date ? new Date(req.body.date) : new Date();
  const ejercicio = new Ejercicio({
    description: req.body.description,
    duration: req.body.duration,
    date: formatDate(date)
  })
  try {
    const userToSave = await Usuario.findByIdAndUpdate(
      { _id: id },
      { $push: { log: ejercicio } }
    );
    res.status(200).json({
      username: userToSave.username,
      description: ejercicio.description,
      duration: ejercicio.duration,
      date: date.toDateString(),
      _id: userToSave._id
    });
    // const ejeToSave = await ejercicio.save();
    // res.status(200).json(userToSave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

app.get('/api/users/:_id/logs', async (req, res) => {
  let id = req.params._id;
  const limit = req.query.limit? Number(req.query.limit) : 100;
  const from = req.query.from ? req.query.from: formatDate(new Date(-8640000000000000));
  const to = req.query.to ? req.query.to : formatDate(new Date(8640000000000000));
  //const from = req.query.from ? req.query.from: new Date(-8640000000000000).toISOString();
  //const to = req.query.to ? req.query.to : new Date(8640000000000000).toISOString();
  console.log(from, to);
  try {
    let logs = await Usuario.aggregate([
      { $match : { _id : new mongoose.Types.ObjectId(id) } },
      { $project: {
        username: 1,
        count: { $size: "$log" },
        _id: 1,
        //log: 1
        log: {
          $filter: {
            input: "$log",
            as: "item",
            cond: {
              $and: [
                {
                  $gte: [ "$$item.date", from ]
                },
                {
                  $lte: [ "$$item.date", to ]
                }
              ] 
            },
            limit: Number(limit)
          }
        } 
      }},
      { $unset: "log._id"}
    ]);
    let updatedLogs = logs[0].log.map(e => {
      const newLog = {};
      newLog['description'] = e.description;
      newLog['duration'] = e.duration;
      newLog['date'] = new Date(e.date).toDateString();
      newLog['_id'] = e._id;

      return newLog;
    });
    logs[0].log = updatedLogs;
    console.log(logs[0]);
    res.send(logs[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

