// Import mongoose and connect to DB
const mongoose = require('mongoose');
const dbString = process.env.MONGO_URI;
mongoose.connect(dbString);
const database = mongoose.connection;
// When connected
database.on('error', (error) => {
  console.error(error);
})
// Message showed once after connection
database.once('connected', () => {
  console.log('Database Connected');
})