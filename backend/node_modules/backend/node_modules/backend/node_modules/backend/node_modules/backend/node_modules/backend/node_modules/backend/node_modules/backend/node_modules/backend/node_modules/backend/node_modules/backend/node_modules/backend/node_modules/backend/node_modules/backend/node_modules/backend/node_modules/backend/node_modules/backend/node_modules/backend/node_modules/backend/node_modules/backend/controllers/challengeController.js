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
                `SELECT 
                    p.progress_id,
                    p.uid,
                    p.challenge_id,
                    p.start_date,
                    p.last_check_in,
                    p.completion_status,
                    p.current_streak,
                    p.completion_count,
                    p.total_points_earned,
                    c.title,
                    c.description,
                    c.duration_days,
                    c.points
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
    deleteChallenge: async (req, res) => {
        try {
            const { progressId } = req.params;
            
            await pool.query('START TRANSACTION');
            try {
                // Check if challenge exists
                const [progress] = await pool.query(
                    'SELECT * FROM user_challenge_progress WHERE progress_id = ?',
                    [progressId]
                );
    
                if (progress.length === 0) {
                    await pool.query('ROLLBACK');
                    return res.status(404).json({ 
                        message: 'Challenge progress not found' 
                    });
                }
    
                // Delete the challenge progress
                await pool.query(
                    'DELETE FROM user_challenge_progress WHERE progress_id = ?',
                    [progressId]
                );
    
                await pool.query('COMMIT');
                return res.json({ 
                    message: 'Challenge deleted successfully',
                    deletedProgressId: progressId 
                });
    
            } catch (error) {
                await pool.query('ROLLBACK');
                throw error;
            }
        } catch (error) {
            console.error('Error deleting challenge:', error);
            return res.status(500).json({ message: error.message });
        }
    },
    startChallenge: async (req, res) => {
        try {
            const { uid, challengeId } = req.body;

            // Check if user already has this challenge in progress
            const [existingProgress] = await pool.query(
                `SELECT * FROM user_challenge_progress 
                 WHERE uid = ? AND challenge_id = ? 
                 AND (completion_status = 'in_progress' OR completion_status IS NULL)`,
                [uid, challengeId]
            );

            if (existingProgress.length > 0) {
                return res.status(400).json({ 
                    message: 'You already have this challenge in progress. Complete it first before starting again.' 
                });
            }

            // If no existing in-progress challenge, create new one
            const progressId = uuidv4();
            const startDate = new Date().toISOString().split('T')[0];

            await pool.query(
                'INSERT INTO user_challenge_progress (progress_id, uid, challenge_id, start_date, completion_status) VALUES (?, ?, ?, ?, ?)',
                [progressId, uid, challengeId, startDate, 'in_progress']
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
            
            await pool.query('START TRANSACTION');
            try {
                const [progress] = await pool.query(
                    'SELECT * FROM user_challenge_progress WHERE progress_id = ?',
                    [progressId]
                );
    
                if (progress.length === 0) {
                    await pool.query('ROLLBACK');
                    return res.status(404).json({ message: 'Progress not found' });
                }
    
                const currentProgress = progress[0];
                let newStreak = currentProgress.current_streak + 1;
    
                const [challenge] = await pool.query(
                    'SELECT duration_days, points FROM eco_challenges WHERE challenge_id = ?',
                    [currentProgress.challenge_id]
                );
    
                if (newStreak >= challenge[0].duration_days) {
                    const earnedPoints = challenge[0].points;
                    // Create new progress entry for the same challenge
                    const newProgressId = uuidv4();
                    
                    // Mark current progress as completed
                    await pool.query(
                        `UPDATE user_challenge_progress 
                         SET completion_status = 'completed',
                             completion_count = completion_count + 1,
                             total_points_earned = total_points_earned + ?,
                             last_check_in = ?
                         WHERE progress_id = ?`,
                        [earnedPoints, today, progressId]
                    );
    
    
                    // Start a new progress for the same challenge
                    await pool.query(
                        `INSERT INTO user_challenge_progress 
                         (progress_id, uid, challenge_id, start_date, current_streak, 
                          completion_status, completion_count, total_points_earned) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [newProgressId, currentProgress.uid, currentProgress.challenge_id, 
                         today, 0, 'in_progress', currentProgress.completion_count + 1, 
                         currentProgress.total_points_earned + earnedPoints]
                    );
                } else {
                    await pool.query(
                        'UPDATE user_challenge_progress SET last_check_in = ?, current_streak = ? WHERE progress_id = ?',
                        [today, newStreak, progressId]
                    );
                }
    
                await pool.query('COMMIT');
                return res.json({ 
                    message: 'Check-in successful',
                    newStreak,
                    isCompleted: newStreak >= challenge[0].duration_days,
                    pointsEarned: newStreak >= challenge[0].duration_days ? challenge[0].points : 0
                });
    
            } catch (error) {
                await pool.query('ROLLBACK');
                throw error;
            }
        } catch (error) {
            console.error('Error checking in:', error);
            return res.status(500).json({ message: error.message });
        }
    }
    };

module.exports = challengeController;