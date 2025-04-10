const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const challengeController = {
    getAllChallenges: async (req, res) => {
        try {
            const [challenges] = await pool.query('SELECT * FROM eco_challenges');
            res.json(challenges);
        } catch (error) {
            console.error('Error fetching challenges:', error);
            res.status(500).json({ message: error.message });
        }
    },

    getUserChallenges: async (req, res) => {
        try {
            const { uid } = req.params;
            const [progress] = await pool.query(
                `SELECT p.*, c.title, c.description, c.duration_days, c.points 
                FROM user_challenge_progress p 
                JOIN eco_challenges c ON p.challenge_id = c.challenge_id 
                WHERE p.uid = ?`,
                [uid]
            );
            res.json(progress);
        } catch (error) {
            console.error('Error fetching user challenges:', error);
            res.status(500).json({ message: error.message });
        }
    },

    startChallenge: async (req, res) => {
        try {
            const { uid, challengeId } = req.body;
            const progressId = uuidv4();
            const startDate = new Date().toISOString().split('T')[0];

            await pool.query(
                'INSERT INTO user_challenge_progress (progress_id, uid, challenge_id, start_date) VALUES (?, ?, ?, ?)',
                [progressId, uid, challengeId, startDate]
            );

            res.status(201).json({ message: 'Challenge started successfully' });
        } catch (error) {
            console.error('Error starting challenge:', error);
            res.status(500).json({ message: error.message });
        }
    },

    checkIn: async (req, res) => {
        try {
            const { progressId } = req.body;
            const today = new Date().toISOString().split('T')[0];
    
            // Get challenge progress
            const [progress] = await pool.query(
                'SELECT * FROM user_challenge_progress WHERE progress_id = ?',
                [progressId]
            );
    
            if (progress.length === 0) {
                return res.status(404).json({ message: 'Progress not found' });
            }
    
            const currentProgress = progress[0];
            const lastCheckIn = currentProgress.last_check_in;
            
            // Check if user already checked in today
            if (lastCheckIn && lastCheckIn === today) {
                return res.status(400).json({ 
                    message: 'You have already checked in today. Come back tomorrow!' 
                });
            }
    
            // Update streak
            let newStreak = currentProgress.current_streak;
            newStreak += 1;
    
            // Update progress
            await pool.query(
                'UPDATE user_challenge_progress SET last_check_in = ?, current_streak = ? WHERE progress_id = ?',
                [today, newStreak, progressId]
            );
    
            // Check if challenge is completed
            const [challenge] = await pool.query(
                'SELECT duration_days FROM eco_challenges WHERE challenge_id = ?',
                [currentProgress.challenge_id]
            );
    
            if (newStreak >= challenge[0].duration_days) {
                // Update completion status and increment completion count
                await pool.query(
                    `UPDATE user_challenge_progress 
                     SET completion_status = ?, 
                         completion_count = completion_count + 1,
                         total_points_earned = total_points_earned + ?
                     WHERE progress_id = ?`,
                    ['completed', challenge[0].points, progressId]
                );
            }
    
            res.json({ message: 'Check-in successful', newStreak });
        } catch (error) {
            console.error('Error checking in:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = challengeController;