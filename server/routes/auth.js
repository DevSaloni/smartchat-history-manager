const express = require('express');
const router = express.Router();
const { signupUser ,loginUser} = require('../controllers/authController');

// Signup Route
router.post('/signup', signupUser);

//login routes
router.post('/login', loginUser);

module.exports = router;
