const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const { mqttClient } = require('./mqttClient');

// dataBase(atlas);
// const DB = process.env.DATABASE.replace(
//   '<password>',
//   process.env.DATABASE_PASSWORD
// );
// mongoose
//   .connect(DB)
//   .then(() => console.log('MongoDB Atlas connected'))
//   .catch((err) => {
//     console.log(err);
//   });

// database(local)
const DB = 'mongodb://root:password@localhost:27017/agv?authSource=admin';
mongoose
  .connect(DB, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => {
    console.log(err);
  });

//server
const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running on port ${server.address().port}`);
});

mqttClient(server);
