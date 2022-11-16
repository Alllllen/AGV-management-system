const Agv = require('./../models/agvModel');
const crud = require('./crudAction');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllAgv = crud.getAll(Agv);
exports.createAgv = crud.createOne(Agv);

// //using redis to create test speed
// const redis = require('./../utils/redis');
// exports.createAgv = async (req, res) => {
//   // redis.set(`${num}`, JSON.stringify(obj));
//   let obj = req.body;
//   if (!redis.exists('num')) await redis.set('num', 0);
//   const num = await redis.incr('num');
//   await redis.set(num, JSON.stringify(obj));
//   res.status(200).json({ status: 'success' });
// };

exports.deleteAgv = crud.deleteOne(Agv);
exports.getAgv = crud.getOne(Agv);
exports.updateAgv = crud.updateOne(Agv);
