const express = require('express');

const path = require('path');

const app = express();

const users = require('./users');

const rootDir = path.dirname(process.mainModule.filename);

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'homework2.html'));
});

app.use(users);

app.listen(3002);
