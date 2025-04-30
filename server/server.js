require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const dashboardRoutes = require('./routes/dashboardRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const membershipAssignmentRoutes = require('./routes/membershipAssignmentRoutes');

const app = express();


// Middleware
app.use(cors());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(express.json());

// Routes
app.use('/api/dashboard', dashboardRoutes);
const memberRoutes = require('./routes/memberRoutes');
app.use('/api/members', memberRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/membership-assignments', membershipAssignmentRoutes);

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));