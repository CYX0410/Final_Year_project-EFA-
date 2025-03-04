const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Debugging middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// Routes
app.use('/api/users', userRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Node.js server is up and running!');
});

// Start the server
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});