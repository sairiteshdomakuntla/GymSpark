
# GymSpark Lite

A lightweight gym management system built with React on the frontend and Express/MongoDB on the backend.

## Frontend Setup

This frontend project is built with React, TypeScript, and Tailwind CSS. It's designed to connect to a separate Express.js/MongoDB backend.

### To run the frontend:

1. Make sure you have Node.js installed
2. Start the development server with the command provided by Lovable

## Backend Setup (Not included in this Lovable project)

You'll need to create a separate backend project using Node.js, Express, and MongoDB. Here's a guide to get started:

### Setting up the Express/MongoDB backend:

1. Create a new directory for your backend project
2. Initialize a new Node.js project:
   ```
   npm init -y
   ```
3. Install required dependencies:
   ```
   npm install express mongoose cors dotenv jsonwebtoken bcryptjs
   npm install nodemon --save-dev
   ```

4. Create a basic folder structure:
   ```
   /backend
     /controllers
     /models
     /routes
     /middleware
     /config
     server.js
     .env
   ```

5. Define your MongoDB schemas in the models folder (Member, Membership, MembershipAssignment)

6. Create API routes in the routes folder that match the endpoints expected by the frontend

7. Implement controller functions that handle the database operations

8. Set up authentication middleware for protecting routes

9. Configure your MongoDB connection in the config folder

10. Create a server.js file that brings everything together

### Example server.js file:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/members', require('./routes/members'));
app.use('/api/memberships', require('./routes/memberships'));
app.use('/api/membership-assignments', require('./routes/membershipAssignments'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Running the backend:

1. Add a start script to your package.json:
   ```json
   "scripts": {
     "start": "node server.js",
     "dev": "nodemon server.js"
   }
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Make sure your backend is running on http://localhost:5000 (or update the API_URL in the frontend)

## API Endpoints

The frontend expects the following API endpoints:

- **Auth:**
  - POST /api/auth/login - Login with email and password

- **Members:**
  - GET /api/members - Get all members
  - GET /api/members/:id - Get a specific member
  - POST /api/members - Create a new member
  - PUT /api/members/:id - Update a member
  - DELETE /api/members/:id - Delete a member
  - GET /api/members/with-memberships - Get members with their memberships

- **Memberships:**
  - GET /api/memberships - Get all membership plans
  - GET /api/memberships/:id - Get a specific membership plan
  - POST /api/memberships - Create a new membership plan
  - PUT /api/memberships/:id - Update a membership plan
  - DELETE /api/memberships/:id - Delete a membership plan

- **Membership Assignments:**
  - GET /api/membership-assignments - Get all membership assignments
  - GET /api/membership-assignments/:id - Get a specific membership assignment
  - POST /api/membership-assignments - Create a new membership assignment
  - PUT /api/membership-assignments/:id - Update a membership assignment
  - DELETE /api/membership-assignments/:id - Delete a membership assignment

- **Dashboard:**
  - GET /api/dashboard/stats - Get dashboard statistics

## Connecting Frontend and Backend

1. Make sure the backend is running on http://localhost:5000
2. The frontend is already configured to connect to this URL in src/services/apiService.ts
3. If your backend runs on a different URL, update the API_BASE_URL in src/config/backendConfig.ts
