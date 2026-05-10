const express = require('express');
const { register, login, logout, getMe, forgotPassword, resetPassword, updateMe, updatePassword, deleteMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.delete('/me', protect, deleteMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);
router.put('/updatepassword', protect, updatePassword);
router.post('/firebase', require('../controllers/authController').firebaseLogin);

module.exports = router;
