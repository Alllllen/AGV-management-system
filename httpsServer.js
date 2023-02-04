const fs = require('fs');
const https = require('https');
const express = require('express');

const app = express();
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 新增憑證 options
const options = {
  key: fs.readFileSync('./ssl/server.key'),
  cert: fs.readFileSync('./ssl/server.crt'),
};
https.createServer(options, app).listen(3000, () => {
  console.log('Started!');
});
