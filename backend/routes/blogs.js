// backend/routes/blogs.js
const express = require('express');
const Blog = require('../models/blog');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
