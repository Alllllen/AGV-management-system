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
router.get('/taskHistory', (req, res) => {
  res.status(200).render('taskHistory', { title: 'taskHistory' });
});
router.get('/assignmentHistory', (req, res) => {
  res.status(200).render('assignmentHistory', { title: 'assignmentHistory' });
});

module.exports = router;
