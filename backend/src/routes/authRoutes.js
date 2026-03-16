const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, updateVibeResult, updateProfile, updatePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User')


// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login  
router.post('/login', login);

// GET /api/auth/me 
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// GET /api/auth/users
router.get('/users', authMiddleware, getAllUsers);

// PATCH /api/auth/vibe
router.patch('/vibe', authMiddleware, updateVibeResult);

// PATCH /api/auth/profile 
router.patch('/profile', authMiddleware, updateProfile);

// PATCH /api/auth/password - change password
router.patch('/password', authMiddleware, updatePassword);

module.exports = router;