const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');

router.post('/sign-up', authController.signup);
router.post('/sign-in', authController.signin);

module.exports = router;