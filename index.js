const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('Hello use!');
  next();
});

app.get('/', (req, res, next) => {
  res.send('<h1>Hello from Express</h1>');
});

app.listen(3001, () => console.log('Server is listen on port 3001'));
