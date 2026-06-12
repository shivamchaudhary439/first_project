const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware')
const rateLimiter = require('../middleware/rateLimiter')
const fileUploade = require('../middleware/file-upload')
const resizeImage = require('../middleware/resize-file.middleware')
router.get('/', (req, res) => {
    res.send('Server Running');
})
router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/profile', auth, userController.profile)
router.post('/sent-otp',rateLimiter, userController.sentOtp)
router.post('/verify-otp', rateLimiter, userController.verifyOtp)
//router.post('/profile-uploade',resizeImage, fileUploade.single('image'), userController.profileUploade)
router.post('/profile-uploade', fileUploade.single('image'), resizeImage, userController.profileUploade)

module.exports = router;