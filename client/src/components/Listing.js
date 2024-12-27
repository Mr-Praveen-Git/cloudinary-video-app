import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Container,
} from '@mui/material';

const Listing = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/uploads')
      .then((response) => {
        console.log('API Response:', response.data);
        setUploads(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching uploads:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (uploads.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h5">No uploads available.</Typography>
      </Box>
    );
  }

  return (
    <Container>
      <Box textAlign="center" marginBottom={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Video List
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Explore all uploaded videos below.
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {uploads.map((upload) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={upload._id}>
            <Card>
              <Link to={`/video/${upload._id}`} style={{ textDecoration: 'none' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={upload.thumbnailUrl || 'https://via.placeholder.com/150'}
                  alt={upload.title || 'Placeholder'}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    style={{ fontWeight: 500 }}
                  >
                    {upload.title || 'Untitled'}
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Listing;
