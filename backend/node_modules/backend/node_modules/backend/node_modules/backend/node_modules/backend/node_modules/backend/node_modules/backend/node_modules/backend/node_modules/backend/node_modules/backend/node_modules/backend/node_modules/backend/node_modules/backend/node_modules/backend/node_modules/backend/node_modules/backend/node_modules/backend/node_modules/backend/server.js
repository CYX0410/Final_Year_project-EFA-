const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(cors({
  origin: [
    'http://localhost:8100',
    'http://localhost:4200',
    'http://localhost',
    'http://18.141.182.235:5010',
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'null',
    '*'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
}));
// CORS configuration - Move this to the top, before other middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const userRoutes = require('./routes/userRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const productRoutes = require('./routes/productRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Body parser middleware
app.use(bodyParser.json());
app.use(limiter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Debugging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
      console.log(`${req.method} request to ${req.url}`);
      console.log('Request body:', req.body);
      next();
  });
}

app.use('/api/challenges', limiter);
app.use('/api/chat', limiter);
// Routes
app.use('/api/users', userRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/challenges', require('./routes/challengeRoutes')); 
app.use('/api/feedback', feedbackRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/products', productRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the EFA API',
    endpoints: {
      users: '/api/users',
      challenges: '/api/challenges',
      products: '/api/products',
      chat: '/api/chat'
    }
  });
});

const PORT = process.env.PORT || 5010;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});