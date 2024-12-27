import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UploadForm from './components/UploadForm';
import Listing from './components/Listing';
import VideoDisplay from './components/VideoDisplay';

const App = () => (
  <Routes>
    <Route path="/" element={<UploadForm />} />
    <Route path="/listing" element={<Listing />} />
    <Route path="/video/:id" element={<VideoDisplay />} />
  </Routes>
);

export default App;
