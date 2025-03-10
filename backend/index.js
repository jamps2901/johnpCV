// backend/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const User = require('./models/User');

const app = express();

// Use Helmet to set secure HTTP headers
app.use(helmet());

// Enable CORS with allowed origins from environment variables (adjust for production)
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS || '*'
  })
);

// Parse JSON bodies
app.use(bodyParser.json());

// Serve uploaded files (for CVs, videos, etc.)
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cvWebsite';
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB connected');

    // Seed default admin account only in development
    if (process.env.NODE_ENV !== 'production') {
      User.findOne({ username: 'admin' })
        .then(user => {
          if (!user) {
            const admin = new User({ username: 'admin', password: 'admin123', isAdmin: true });
            admin
              .save()
              .then(() => console.log("Default admin created: username 'admin', password 'admin123'"))
              .catch(err => console.error("Error creating admin:", err));
          } else {
            console.log("Admin account already exists.");
          }
        })
        .catch(err => console.error("Error checking admin:", err));
    } else {
      console.log("Skipping default admin seeding in production.");
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
