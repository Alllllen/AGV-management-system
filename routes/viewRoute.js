const express = require('express');
// const vuewController
const router = express.Router();
// const viewConroller = require('./../controllers/viewController');

router.get('/', (req, res) => {
  res.status(200).render('index', { title: 'index' });
});
router.get('/login', (req, res) => {
  res.status(200).render('login', { title: 'login' });
});
router.get('/register', (req, res) => {
  res.status(200).render('register', { title: 'register' });
});
router.get('/createTask', (req, res) => {
  res.status(200).render('createTask', { title: 'createTask' });
});
// router.get('/createTask', viewConroller.getCreateTaskInfo);

module.exports = router;
