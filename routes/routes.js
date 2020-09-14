const express = require('express');
const constants = require('../constants');
const { authCheck } = require('../middleware/authCheck');
const { userCheck } = require('../middleware/userCheck');
const router = express.Router();

// GET - All Routes
router.get('*', userCheck);

// GET - Index Route
router.get('/', (req, res) => res.render('index', {
    title: constants.titleHome
}));

// GET - Profile Route
router.get('/profile', authCheck, (req, res) => res.render('profile', {
    title: constants.titleProfile
}));

module.exports = router;