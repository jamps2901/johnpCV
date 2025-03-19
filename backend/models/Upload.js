// backend/models/Upload.js
const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: { type: String, required: true },
  thumbnail: { type: String, required: true }, // Auto-generated thumbnail (placeholder or via FFmpeg)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Upload', UploadSchema);
