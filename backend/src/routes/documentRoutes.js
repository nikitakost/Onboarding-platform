const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Document = require('../models/Document');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.use(authMiddleware);

// POST /api/documents 
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не передано' });
    }

    const doc = new Document({
      user: req.user.userId,
      name: req.body.name || req.file.originalname, 
      fileUrl: `/uploads/${req.file.filename}` 
    });

    await doc.save();
    await doc.populate('user', 'name email');
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при збереженні документа' });
  }
});

// GET /api/documents 
router.get('/', async (req, res) => {
  try {
    let docs;
    if (req.user.role === 'HR') {
      // HR бачить усі документи всіх співробітників
      docs = await Document.find().populate('user', 'name email').sort({ createdAt: -1 });
    } else {
      // Співробітник бачить тільки свої
      docs = await Document.find({ user: req.user.userId }).populate('user', 'name email').sort({ createdAt: -1 });
    }
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні документів' });
  }
});

module.exports = router;