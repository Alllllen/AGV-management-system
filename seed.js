const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const agvSeed = require('./seeders/agvSeed');
const foundSeed = require('./seeders/foundSeed');
const userSeed = require('./seeders/userSeed');
const taskSeed = require('./seeders/taskSeed');

//dataBase
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(async (db) => {
    console.log('MongoDB Atlas connected');

    // await foundSeed.clearFounds();
    // await foundSeed.setFounds();

    await agvSeed.clearAgv();
    await agvSeed.setAgv();

    await userSeed.clearUser();
    await userSeed.setUser();

    await taskSeed.clearTask();
    await taskSeed.setTask();

    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err.message);
  });
