const express = require('express');
const router = express.Router();
const agvController = require('./../controllers/agvController');
const authController = require('./../controllers/authController');

router
  .route('/')
  .get(agvController.getAllAgv)
  .post(authController.protect, agvController.createAgv);

router
  .route('/:id')
  .get(agvController.getAgv)
  .delete(authController.protect, agvController.deleteAgv)
  .patch(authController.protect, agvController.updateAgv);

module.exports = router;
