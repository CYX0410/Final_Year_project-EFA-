const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const ecoKeywords = [
    'eco', 'environment', 'sustainable', 'green', 'recycling', 'renewable',
    'climate', 'conservation', 'waste', 'energy', 'pollution', 'biodegradable',
    'composting', 'reusable', 'organic', 'carbon', 'footprint', 'nature',
    'sustainable', 'environmental', 'ecology', 'water', 'saving', 'tips', 
    'guide', 'daily', 'home', 'zero', 'living', 'lifestyle', 'types',
    'materials', 'properly', 'effective', 'ways', 'save', 'conserve'
];

const chatController = {
    handleChatMessage: async (req, res) => {
        const userMessage = req.body.message;
        try {
            // Improve keyword detection by checking word combinations
            const words = userMessage.toLowerCase().split(' ');
            const isEcoRelated = ecoKeywords.some(keyword => 
                words.some(word => word.includes(keyword)) || 
                userMessage.toLowerCase().includes(keyword)
            );

            // Always process predefined topic suggestions
            if (isPreDefinedTopic(userMessage)) {
                const result = await model.generateContent(getChatPrompt(userMessage));
                const response = result.response;
                const formattedResponse = response.text()
                    .split('\n')
                    .filter(line => line.trim().length > 0)
                    .join('\n\n');
                return res.json({ message: formattedResponse });
            }

            if (!isEcoRelated) {
                return res.json({
                    message: getDefaultEcoTopicsMessage()
                });
            }

            // ... rest of your existing code
        } catch (error) {
            console.error('Error generating response:', error);
            res.status(500).json({ 
                message: "**Note**: I can only provide eco-friendly advice. Please ask about environmental topics."
            });
        }
    }
};
function isPreDefinedTopic(message) {
    const predefinedTopics = [
        'What are some daily sustainable living tips?',
        'How to recycle different types of materials properly?',
        'What are effective ways to save energy at home?',
        'How can I conserve water in daily life?',
        'Give me tips for zero waste lifestyle'
    ];
    return predefinedTopics.includes(message);
}

function getDefaultEcoTopicsMessage() {
    return "I can only answer questions about environmental and eco-friendly topics. Please ask about:\n\n" +
           "**Sustainable Living**: Tips for eco-friendly lifestyle\n\n" +
           "**Recycling**: Proper waste management methods\n\n" +
           "**Energy**: Conservation and renewable sources\n\n" +
           "**Waste**: Reduction strategies and composting\n\n" +
           "**Green Products**: Eco-friendly alternatives\n\n" +
           "**Conservation**: Environmental protection methods";
}

function getChatPrompt(userMessage) {
    return `Provide eco-friendly advice about: ${userMessage}

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
    **Eco Shopping**: Choose products with minimal packaging.`;
}

module.exports = chatController;