const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const agvSeed = require('./seeders/agvSeed');
const foundSeed = require('./seeders/foundSeed');
const userSeed = require('./seeders/userSeed');
const taskSeed = require('./seeders/taskSeed');

// //dataBase  (atlas)
// const DB = process.env.DATABASE.replace(
//   '<password>',
//   process.env.DATABASE_PASSWORD
// );

// database(local)
const DB = 'mongodb://root:password@localhost:27017/agv?authSource=admin';

mongoose
  .connect(DB, { useNewUrlParser: true })
  .then(async () => {
    console.log('MongoDB Local connected');

    await foundSeed.clearFounds();
    await foundSeed.setFounds();

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
