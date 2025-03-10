// backend/routes/admin.js
const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Upload = require('../models/Upload');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

// Middleware to verify token and admin privileges
const verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Failed to authenticate token' });
    if (!decoded.isAdmin) return res.status(403).json({ error: 'Not authorized' });
    req.userId = decoded.id;
    next();
  });
};

// Route to upload a new video/tutorial with input validation
router.post(
  '/upload',
  verifyAdmin,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('videoUrl').isURL().withMessage('Valid video URL is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { title, description, videoUrl } = req.body;
    try {
      const upload = new Upload({ title, description, videoUrl });
      await upload.save();
      res.json({ message: 'Upload successful', upload });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Route to get all uploads (admin view)
router.get('/uploads', verifyAdmin, async (req, res) => {
  try {
    const uploads = await Upload.find().sort({ createdAt: -1 });
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set up Multer storage for CV uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    // Save the file as "latest_cv" with its original extension
    cb(null, 'latest_cv' + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Route to upload the latest CV file with basic validation
router.post('/upload-cv', verifyAdmin, upload.single('cv'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ message: 'CV uploaded successfully', cvPath: req.file.path });
});

module.exports = router;
