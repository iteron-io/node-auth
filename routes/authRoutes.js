const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Signup Page
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);

// Login Page
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

// Logout
router.get('/logout', authController.logout_get);

module.exports = router;