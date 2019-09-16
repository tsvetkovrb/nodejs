const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const validation = require('../middlewares/validation');

router.get('/login', authController.getLogin);
router.post('/login', validation.postLogin, authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post('/signup', validation.postSignup, authController.postSignup);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
