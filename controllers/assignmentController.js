const Assignment = require('./../models/AssignmentModel');
const crud = require('./crudAction');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllAssignment = crud.getAll(Assignment);
// exports.createTask = crud.createOne(Task);
// exports.deleteTask = crud.deleteOne(Task);
// exports.getTask = crud.getOne(Task);
// exports.updateTask = crud.updateOne(Task);
