const express = require('express');
const router = express.Router();
const assignmentRoute = require('./assignmentRoute');
const taskController = require('./../controllers/taskController');
const authController = require('./../controllers/authController');

router.use('/:taskId/assignment', assignmentRoute);

router
  .route('/')
  .get(taskController.getAllTasks)
  .post(authController.protect, taskController.createTask);

router
  .route('/:id')
  .get(taskController.getTask)
  .delete(authController.protect, taskController.deleteTask)
  .patch(authController.protect, taskController.updateTask);

module.exports = router;
