const Task = require('./../models/taskModel');
const crud = require('./crudAction');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllTasks = crud.getAll(Task);
exports.createTask = crud.createOne(Task);
exports.deleteTask = crud.deleteOne(Task);
exports.getTask = crud.getOne(Task);
exports.updateTask = crud.updateOne(Task);
