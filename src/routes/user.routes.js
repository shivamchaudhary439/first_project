const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware')
const rateLimiter = require('../middleware/rateLimiter')
router.get('/', (req, res) => {
    res.send('Server Running');
})
router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/profile', auth, userController.profile)
router.post('/sent-otp',rateLimiter, userController.sentOtp)
router.post('/verify-otp', rateLimiter, userController.verifyOtp)

module.exports = router;