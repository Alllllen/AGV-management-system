const express = require('express');
const router = express.Router();
const taskController = require('taskController');

router
  .route('/')
  .get(taskController.getTask)
  .post(taskController.createTask)
  .delete(taskController.deleteTask);
