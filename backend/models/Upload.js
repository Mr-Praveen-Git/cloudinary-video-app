const mongoose = require('mongoose');

// Define schema
const UploadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  videoUrl: { type: String, required: true },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Export model
module.exports = mongoose.model('Upload', UploadSchema);
