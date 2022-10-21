const express = require('express');
// const vuewController
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).render('index', { title: 'index' });
});
router.get('/login', (req, res) => {
  res.status(200).render('login', { title: 'login' });
});
router.get('/register', (req, res) => {
  res.status(200).render('register', { title: 'register' });
});

module.exports = router;
