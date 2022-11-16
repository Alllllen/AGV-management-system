'use strict';
const Agv = require('./../models/agvModel');
const Park = require('./../models/foundations/parkModel');
const catchAsync = require('./../utils/catchAsync');

exports.setAgv = () => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      const parkEntry = await Park.find({});
      const agvData = Array.from({ length: 50 }).map((d, i) => ({
        name: `agv${i}`,
        x: parkEntry[i % parkEntry.length]['entryX'],
        y: parkEntry[i % parkEntry.length]['entryY'],
        z: parkEntry[i % parkEntry.length]['z'],
      }));
      await Agv.insertMany(agvData);
      console.log('set agv data');
      resolve();
    })
  );
};

exports.clearAgv = () => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      await Agv.deleteMany({});
      console.log('clear agv data');
      resolve();
    })
  );
};
