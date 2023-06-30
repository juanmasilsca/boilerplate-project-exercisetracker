const express = require('express');
const mongoose = require('mongoose');

const Ejercicio = require('../models/ejercicio');
const Usuario = require('../models/usuario');
const Log = require('../models/log');

const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Post Method
// router.post('/users', async (req, res) => {
//   const user = new Usuario({
//     username: req.body.username,
//   })
//   try {
//     const userToSave = await user.save();
//     res.status(200).json.stringify(userToSave);
//   } catch (error) {
//     res.status(400).json({ message: error.message })
//   }
// })

// router.get('/users', async (req, res) => {
//   try {
//     const users = await Usuario.find({},{__v: 0, log: 0});
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({message: error.message});
//   }
// })

// router.post('/users/:_id/exercises', async (req, res) => {
//   const id = req.params._id;
//   const ejercicio = new Ejercicio({
//     //userId: id,
//     description: req.body.description,
//     duration: req.body.duration,
//     date: req.body.date || formatDate(new Date())
//   })
//   try {
//     const userToSave = await Usuario.findByIdAndUpdate(
//       { _id: id },
//       { $push: { log: ejercicio } }
//     );
//     res.status(200).json({ 
//       username: userToSave.username,
//       description: ejercicio.description,
//       duration: ejercicio.duration,
//       date: ejercicio.date, 
//       _id: id, 
//     });
//     // const ejeToSave = await ejercicio.save();
//     // res.status(200).json(userToSave);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// })

const formatDate = (date) => {
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

router.get('/users/:_id/logs', async (req, res) => {
  let id = req.params._id;
  const limit = req.query.limit? Number(req.query.limit) : 100;
  const from = req.query.from? req.query.from : formatDate(new Date(-8640000000000000));
  const to = req.query.to? req.query.to : formatDate(new Date(8640000000000000));
  console.log(limit, from, to);
  console.log("2023-06-01" >= from);
  try {
    let logs = await Usuario.aggregate([
      { $match : { _id : new mongoose.Types.ObjectId(id) } },
      { $project: {
        username: 1,
        count: { $size: "$log" },
        _id: 1, 
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
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

module.exports = router;