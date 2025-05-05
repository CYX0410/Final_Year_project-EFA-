const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const ecoKeywords = [
    'eco', 'environment', 'sustainable', 'green', 'recycling', 'renewable',
    'climate', 'conservation', 'waste', 'energy', 'pollution', 'biodegradable',
    'composting', 'reusable', 'organic', 'carbon', 'footprint', 'nature',
    'sustainable', 'environmental', 'ecology'
];

const chatController = {
    handleChatMessage: async (req, res) => {
        const userMessage = req.body.message;
        try {
            const isEcoRelated = ecoKeywords.some(keyword => 
                userMessage.toLowerCase().split(' ').includes(keyword)
            );

            if (!isEcoRelated) {
                return res.json({
                    message: getDefaultEcoTopicsMessage()
                });
            }

            const result = await model.generateContent(getChatPrompt(userMessage));
            const response = result.response;

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
    }
};

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