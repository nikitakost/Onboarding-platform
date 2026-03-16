const express = require('express');
const router = express.Router();
const { getWelcomeLetter, updateWelcomeLetter } = require('../controllers/settingController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/settings/welcome 
router.get('/welcome', getWelcomeLetter);

// PATCH /api/settings/welcome 
router.patch('/welcome', updateWelcomeLetter);

module.exports = router;