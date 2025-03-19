// backend/routes/admin.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');
const Upload = require('../models/Upload');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/mkv', 'video/avi', 'image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
  } else {
      cb(new Error('Invalid file type'), false);
  }
};
const upload = multer({ storage, fileFilter });

// Apply authentication middleware to all admin routes
router.use(authMiddleware);

// --------- Sample Projects (Video Uploads) --------- //
router.post('/sample-projects', upload.single('video'), async (req, res) => {
  try {
    const { title, description } = req.body;
    console.log('Sample project upload received:', req.body);
    if (!req.file) {
      return res.status(400).json({ error: 'No video file received' });
    }
    // video file path and thumbnail generation (placeholder)
    const videoUrl = req.file.path;
    const thumbnail = '/uploads/placeholder-thumbnail.png'; // Replace with actual thumbnail generation logic if available
    const sampleProject = new Upload({ title, description, videoUrl, thumbnail });
    await sampleProject.save();
    res.json({ sampleProject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/sample-projects/:id', async (req, res) => {
  try {
    const sampleProject = await Upload.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ sampleProject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/sample-projects/:id', async (req, res) => {
  try {
    await Upload.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sample project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --------- Blog Management --------- //
router.post('/blogs', async (req, res) => {
  try {
    const { title, content, image } = req.body;
    console.log('Blog creation received:', req.body);
    const blog = new Blog({ title, content, image });
    await blog.save();
    res.json({ blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
