// backend/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const sampleProjectsRoutes = require('./routes/sampleProjects');
const blogsRoutes = require('./routes/blogs');

const app = express();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('Uploads folder created.');
}

// Serve uploaded files and static frontend files
app.use('/uploads', express.static(uploadDir));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Security, CORS, and Body Parser
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || '*' }));
app.use(bodyParser.json());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sample-projects', sampleProjectsRoutes);
app.use('/api/blogs', blogsRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB and start the server
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/johnpcv';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
  })
  .catch(err => console.error('MongoDB connection error:', err));
