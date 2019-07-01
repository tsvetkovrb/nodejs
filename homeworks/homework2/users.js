const router = require('express').Router();
const path = require('path');

const rootDir = path.dirname(process.mainModule.filename);

router.get('/users', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

module.exports = router;
