const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const Upload = require('./models/Upload'); 

dotenv.config();

// Configure Cloudinary (replace with your credentials)
cloudinary.config({
  cloud_name: 'djovxrofd',
  api_key: '656624745221695',
  api_secret: 'QBxKHQnOxsRKtttBAWu-SB6_f_s'
});

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Configure multer for file uploads
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

// Define the route to save uploads
app.post('/api/upload', async (req, res) => {
  const { title, description, imgUrl, vidUrl } = req.body;

  try {
    const newUpload = new Upload({
      title,
      description,
      thumbnailUrl: imgUrl,
      videoUrl: vidUrl,
    });

    await newUpload.save();
    res.status(201).json({ message: 'Upload saved successfully', upload: newUpload });
  } catch (error) {
    console.error('Error saving upload:', error);
    res.status(500).json({ error: 'Failed to save upload' });
  }
});

app.get('/api/uploads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const upload = await Upload.findById(id);

    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }

    res.json(upload);
  } catch (error) {
    console.error('Error fetching upload:', error);
    res.status(500).json({ error: 'Failed to fetch upload' });
  }
});


// Define the route to fetch all uploads
app.get('/api/uploads', async (req, res) => {
  try {
    const uploads = await Upload.find();
    res.json(uploads);
  } catch (error) {
    console.error('Error fetching uploads:', error);
    res.status(500).json({ error: 'Failed to fetch uploads' });
  }
});

// Define a route for file uploads to Cloudinary
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_stream({ resource_type: "auto" });
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
