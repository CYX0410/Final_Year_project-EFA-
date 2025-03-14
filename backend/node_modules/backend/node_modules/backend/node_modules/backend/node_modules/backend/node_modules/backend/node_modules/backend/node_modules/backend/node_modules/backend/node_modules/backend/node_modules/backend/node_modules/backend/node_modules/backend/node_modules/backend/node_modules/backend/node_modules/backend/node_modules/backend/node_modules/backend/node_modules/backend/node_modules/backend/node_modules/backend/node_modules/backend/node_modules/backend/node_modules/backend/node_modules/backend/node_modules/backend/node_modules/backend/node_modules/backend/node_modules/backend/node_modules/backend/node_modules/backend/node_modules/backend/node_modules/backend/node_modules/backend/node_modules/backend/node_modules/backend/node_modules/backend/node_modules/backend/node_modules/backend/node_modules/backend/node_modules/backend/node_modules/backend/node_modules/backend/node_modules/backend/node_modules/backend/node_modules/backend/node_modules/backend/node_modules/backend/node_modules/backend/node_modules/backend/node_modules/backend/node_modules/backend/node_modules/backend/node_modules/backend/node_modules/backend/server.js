const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
require('dotenv').config();
const app = express();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// CORS configuration - Move this to the top, before other middleware
app.use(cors({
  origin: ['http://localhost:8100', 'http://localhost:4200'], // Add both development URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Enable credentials if needed
}));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Ensure this is added to parse JSON requests

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  try {
    // Add context for environmental focus
    const prompt = `As an environmental expert, provide advice about: ${userMessage}
    Focus on:
    - Sustainable living practices
    - Environmental conservation
    - Eco-friendly alternatives
    - Practical tips for daily life
    Keep responses concise and actionable.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    res.json({ message: response.text() });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Failed to generate response' });
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
app.use('/api/challenges', challengeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});