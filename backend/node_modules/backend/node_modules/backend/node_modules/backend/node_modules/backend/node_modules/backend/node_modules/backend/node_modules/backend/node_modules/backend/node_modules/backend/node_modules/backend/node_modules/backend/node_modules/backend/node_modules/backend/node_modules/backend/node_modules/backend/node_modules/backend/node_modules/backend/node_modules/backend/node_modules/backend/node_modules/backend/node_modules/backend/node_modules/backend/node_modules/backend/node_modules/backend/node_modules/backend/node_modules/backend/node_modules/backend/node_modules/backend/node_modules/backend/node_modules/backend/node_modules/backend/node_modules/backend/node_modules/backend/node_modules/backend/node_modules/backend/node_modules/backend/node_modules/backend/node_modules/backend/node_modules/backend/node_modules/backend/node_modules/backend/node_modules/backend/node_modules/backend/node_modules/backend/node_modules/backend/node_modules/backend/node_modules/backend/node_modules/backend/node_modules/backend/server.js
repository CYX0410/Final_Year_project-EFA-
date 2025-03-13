const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
// Add to existing routes
app.use('/api/challenges', require('./routes/challengeRoutes'));
// CORS configuration
app.use(cors({
  origin: 'http://localhost:8100', // Your Ionic app URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});