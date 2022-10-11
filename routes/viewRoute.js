const express = require('express');
const router = express.Router();

router.get('/index', (req, res) => {
  res.status(200).render('index', { title: 'index' });
});

module.exports = router;
