const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const productRoutes = require('./routes/productRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
require('dotenv').config();
const app = express();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const rateLimit = require('express-rate-limit');
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
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  try {
    const ecoKeywords = [
      'eco', 'environment', 'sustainable', 'green', 'recycling', 'renewable',
      'climate', 'conservation', 'waste', 'energy', 'pollution', 'biodegradable',
      'composting', 'reusable', 'organic', 'carbon', 'footprint', 'nature',
      'sustainable', 'environmental', 'ecology'
    ];

    const isEcoRelated = ecoKeywords.some(keyword => 
      userMessage.toLowerCase().split(' ').includes(keyword)
    );

    if (!isEcoRelated) {
      return res.json({
        message: "I can only answer questions about environmental and eco-friendly topics. Please ask about:\n\n" +
                "**Sustainable Living**: Tips for eco-friendly lifestyle\n\n" +
                "**Recycling**: Proper waste management methods\n\n" +
                "**Energy**: Conservation and renewable sources\n\n" +
                "**Waste**: Reduction strategies and composting\n\n" +
                "**Green Products**: Eco-friendly alternatives\n\n" +
                "**Conservation**: Environmental protection methods"
      });
    }

    const prompt = `Provide eco-friendly advice about: ${userMessage}

   Requirements:
   1. Each point must be on its own line
   2. Format each point as "**[Title]**: [Clear, concise explanation]"
   3. Only discuss environmental topics
   4. Keep explanations practical and actionable
   5. Use title case for titles
   6. Exactly 5 points total

   Example format:
   **Reduce Water Usage**: Install water-efficient fixtures and fix leaks promptly.

   **Save Energy**: Use LED bulbs and turn off unused devices.

   **Reduce Waste**: Compost organic materials and recycle properly.

   **Green Transport**: Use public transit or bike when possible.

   **Eco Shopping**: Choose products with minimal packaging.

  If the question isn't about environmental topics, respond with the standard eco-topics message.`;

  const result = await model.generateContent(prompt);
  const response = result.response;

  // Format the response with double line breaks
  const formattedResponse = response.text()
      .split('\n')
      .filter(line => line.trim().length > 0)
      .join('\n\n');

    res.json({ message: formattedResponse });

  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ 
      message: "**Note**: I can only provide eco-friendly advice. Please ask about environmental topics."
    });
  }
});
// Debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/challenges', limiter);
app.use('/api/challenges', challengeRoutes);
app.use('/api', productRoutes);
app.use('/api/feedback', feedbackRoutes);
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