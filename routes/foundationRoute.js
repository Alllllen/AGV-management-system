const express = require('express');
const router = express.Router();
const foundationController = require('./../controllers/foundationController');
// const authController = require('./../controllers');

router.route('/block').get(foundationController.getAllBlock);
router.route('/block/:id').get(foundationController.getBlock);

router.route('/section/:id').get(foundationController.getSection);
module.exports = router;
