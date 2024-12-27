const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const mongoose = require('mongoose');
const Upload = require('../models/Upload'); // Your MongoDB schema file

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer Configuration for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Folder name in Cloudinary
    resource_type: 'auto', // Automatically detect type (image or video)
    allowed_formats: ['jpg', 'png', 'mp4', 'avi', 'mpg'], // Allowed file formats
  },
});

const upload = multer({ storage });

// Upload API Route
router.post('/upload', upload.fields([{ name: 'thumbnail' }, { name: 'video' }]), async (req, res) => {
  try {
    // Extract Cloudinary URLs
    const thumbnailUrl = req.files['thumbnail'][0].path;
    const videoUrl = req.files['video'][0].path;

    // Save upload details to MongoDB
    const newUpload = new Upload({
      title: req.body.title,
      description: req.body.description,
      thumbnailUrl: thumbnailUrl,
      videoUrl: videoUrl,
    });

    await newUpload.save();
    res.status(201).json(newUpload);
  } catch (error) {
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});

// Fetch All Uploads
router.get('/uploads', async (req, res) => {
  try {
    const uploads = await Upload.find();
    res.status(200).json(uploads);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch uploads', error: error.message });
  }
});

// Fetch Single Upload by ID
router.get('/uploads/:id', async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ message: 'Upload not found' });
    res.status(200).json(upload);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch upload', error: error.message });
  }
});

module.exports = router;
