const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.use(authMiddleware);

// POST /api/tasks
router.post('/', createTask);

// GET /api/tasks
router.get('/', getTasks);

// PATCH /api/tasks/:id/status
router.patch('/:id/status', updateTaskStatus);

module.exports = router;