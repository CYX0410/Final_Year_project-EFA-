const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const rateLimit = require('express-rate-limit');

const userRoutes = require('./routes/userRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const productRoutes = require('./routes/productRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// CORS configuration - Move this to the top, before other middleware
app.use(cors({
  origin: ['http://localhost:8100', 'http://localhost:4200'], // Add both development URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Enable credentials if needed
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
// Body parser middleware
app.use(bodyParser.json());
app.use(limiter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/challenges', require('./routes/challengeRoutes')); // Ensure this is added to parse JSON requests

// Debugging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
      console.log(`${req.method} request to ${req.url}`);
      console.log('Request body:', req.body);
      next();
  });
}

// Routes
app.use('/api/users', userRoutes);
app.use('/api/challenges', limiter);
app.use('/api/challenges', challengeRoutes);
app.use('/api', productRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/chat', chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: err.message });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the EFA API',
    endpoints: {
      users: '/api/users',
      challenges: '/api/challenges',
      products: '/api/products',
      chat: '/chat'
    }
  });
});

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});