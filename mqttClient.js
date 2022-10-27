//mqtt pub sub
//dataBase
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(async () => {
    console.log('MongoDB Atlas connected');
  })
  .catch((err) => {
    console.log(err.message);
  });
