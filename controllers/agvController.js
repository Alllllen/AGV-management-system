const Agv = require('./../models/agvModel');
const crud = require('./crudAction');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllAgv = crud.getAll(Agv);
exports.createAgv = crud.createOne(Agv);
exports.deleteAgv = crud.deleteOne(Agv);
exports.getAgv = crud.getOne(Agv);
exports.updateAgv = crud.updateOne(Agv);
