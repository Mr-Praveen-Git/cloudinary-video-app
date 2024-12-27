import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, CircularProgress } from '@mui/material';
import './VideoPlayer.css'; // Import custom CSS for styling

const VideoPlayer = () => {
  const { id } = useParams(); // Get the video ID from the URL
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch video details by ID
    axios
      .get(`http://localhost:5000/api/uploads/${id}`) // Adjust route as needed
      .then((response) => {
        setVideoData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching video details:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!videoData) {
    return <Typography variant="h6" align="center" color="error">
      Video not found.
    </Typography>;
  }

  return (
    <Box padding={3} display="flex" flexDirection="column" alignItems="center" className="video-player-container">
      <Typography variant="h4" gutterBottom className="video-title">
        {videoData.title}
      </Typography>
      <video 
        controls 
        autoPlay 
        width="100%" 
        style={{ maxWidth: '800px', borderRadius: '8px', marginTop: '20px' }}
      >
        <source src={videoData.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Typography variant="body1" marginTop={2} align="center">
        {videoData.description}
      </Typography>
    </Box>
  );
};

export default VideoPlayer;
