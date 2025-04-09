const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const feedbackController = {
    submitFeedback: async (req, res) => {
        try {
            const { uid, message, rating } = req.body;
            const feedback_id = uuidv4();

            if (!uid || !message) {
                return res.status(400).json({ 
                    message: 'User ID and feedback message are required' 
                });
            }

            // Check if user exists
            const [userRows] = await pool.query('SELECT * FROM users WHERE uid = ?', [uid]);
            if (userRows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Insert feedback
            await pool.query(
                'INSERT INTO user_feedback (feedback_id, uid, message, rating) VALUES (?, ?, ?, ?)',
                [feedback_id, uid, message, rating]
            );

            res.status(201).json({
                message: 'Feedback submitted successfully',
                feedback_id
            });

        } catch (error) {
            console.error('Error submitting feedback:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = feedbackController;