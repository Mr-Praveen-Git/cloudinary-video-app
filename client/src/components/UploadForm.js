import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Box, TextField, Button, Typography, CircularProgress, Paper } from "@mui/material";

const UploadForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    video: null,
  });
  const [loading, setLoading] = useState(false); // State to track loading
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setSuccessMessage(""); // Clear previous messages
    try {
      // Upload image and video to Cloudinary
      const imgUrl = await uploadFile("image");
      const vidUrl = await uploadFile("video");

      // Send the URLs to your backend for processing (if needed)
      await axios.post("http://localhost:5000/api/upload", {
        title: formData.title,
        description: formData.description,
        imgUrl,
        vidUrl,
      });

      // Reset form data
      setFormData({
        title: "",
        description: "",
        image: null,
        video: null,
      });

      setSuccessMessage("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setSuccessMessage("Error uploading file. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Upload file to Cloudinary
  const uploadFile = async (type) => {
    const data = new FormData();
    const file = type === "image" ? formData.image : formData.video;

    if (!file) {
      throw new Error(`No ${type} file selected`);
    }

    data.append("file", file);
    data.append(
      "upload_preset",
      type === "image" ? "image_preset" : "video_preset"
    );

    try {
      const cloudName = "djovxrofd"; // Replace with your Cloudinary cloud name
      const resourceType = type === "image" ? "image" : "video";
      const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      // Upload the file to Cloudinary
      const res = await axios.post(api, data, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the request is properly formatted
        },
      });

      const { secure_url } = res.data;
      console.log(`${type} URL:`, secure_url);
      return secure_url;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      throw error;
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f9f9f9"
    >
      <Paper
        elevation={3}
        sx={{ padding: 4, width: "100%", maxWidth: "500px", textAlign: "center" }}
      >
        <Typography variant="h4" gutterBottom>
          Upload Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
          <Typography align="left" sx={{ marginTop: 2 }}>
            Upload Thumbnail:
          </Typography>
          <input
            type="file"
            name="image"
            accept=".jpg,.png"
            onChange={handleChange}
            style={{ marginTop: "10px" }}
          />
          <Typography align="left" sx={{ marginTop: 2 }}>
            Upload Video:
          </Typography>
          <input
            type="file"
            name="video"
            accept=".mpg,.avi,.mp4"
            onChange={handleChange}
            style={{ marginTop: "10px" }}
          />
          <Box mt={3} mb={1}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Upload"}
            </Button>
          </Box>
        </form>
        {successMessage && (
          <Typography variant="body1" color="success.main" mt={2}>
            {successMessage}
          </Typography>
        )}
        <Box mt={3}>
          <Link to="/listing" style={{ textDecoration: "none" }}>
            <Button variant="outlined" color="secondary" fullWidth>
              View Uploaded Items
            </Button>
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default UploadForm;
