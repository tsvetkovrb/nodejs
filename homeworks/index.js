const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('From first middleware');
  next();
});

app.use((req, res, next) => {
  console.log('From second middleware');
  next();
});

app.get('/users', (req, res, next) => {
  console.log('Hello from /users');
  next();
});

app.use('/users', (req, res) => {
  console.log('Hello from users middleware');
  const list = `
  <ul>
    <li>Text</li>
    <li>Text</li>
    <li>Text</li>
    <li>Text</li>
    <li>Text</li>
  </ul>
  `;

  res.send(list);
});

app.get('/', (req, res, next) => {
  console.log('Hello from /');
  next();
});

app.use('/', (req, res) => {
  console.log('Hello from / middleware');
  res.send('<h1>Hello from /</h1>');
});

app.listen(3001);
