const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// ... other imports

const app = express();

// CORS middleware should be one of the first middleware
app.use(cors());

// Other middleware should come after CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes come after all middleware
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// ... other routes

// Error handling middleware should be last
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// ... rest of your configuration
