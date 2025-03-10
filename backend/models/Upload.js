// backend/models/Upload.js
const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: { type: String, required: true }, // URL for the video/tutorial
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Upload', UploadSchema);
