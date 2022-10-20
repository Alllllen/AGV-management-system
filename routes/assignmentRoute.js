const express = require('express');
const router = express.Router({ mergeParams: true });
const assignmentController = require('./../controllers/assignmentController');
const authController = require('./../controllers/authController');

router
  .route('/')
  .get(assignmentController.getAllAssignment)
  .post(authController.protect, assignmentController.createAssignment);

router
  .route('/:id')
  .get(assignmentController.getAssignment)
  .delete(authController.protect, assignmentController.deleteAssignment)
  .patch(authController.protect, assignmentController.updateAssignment);

module.exports = router;
