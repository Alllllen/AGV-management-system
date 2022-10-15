const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const foundationController = require('./controllers/foundationController');

//dataBase
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(async () => {
    console.log('MongoDB Atlas connected');

    //writedoundationDB
    await foundationController.clearFounds();

    foundationController.saveWall();
    foundationController.saveElevator();
    foundationController.saveCharge();
    foundationController.savePark();

    await foundationController.saveSection();
    foundationController.saveBlock();

    await foundationController.saveVertex();
    foundationController.saveGuidePath();
  })
  .catch((err) => {
    console.log(err.message);
  });
