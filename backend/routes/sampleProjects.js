// backend/routes/sampleProjects.js
const express = require('express');
const Upload = require('../models/Upload');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sampleProjects = await Upload.find().sort({ createdAt: -1 });
    res.json(sampleProjects);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
