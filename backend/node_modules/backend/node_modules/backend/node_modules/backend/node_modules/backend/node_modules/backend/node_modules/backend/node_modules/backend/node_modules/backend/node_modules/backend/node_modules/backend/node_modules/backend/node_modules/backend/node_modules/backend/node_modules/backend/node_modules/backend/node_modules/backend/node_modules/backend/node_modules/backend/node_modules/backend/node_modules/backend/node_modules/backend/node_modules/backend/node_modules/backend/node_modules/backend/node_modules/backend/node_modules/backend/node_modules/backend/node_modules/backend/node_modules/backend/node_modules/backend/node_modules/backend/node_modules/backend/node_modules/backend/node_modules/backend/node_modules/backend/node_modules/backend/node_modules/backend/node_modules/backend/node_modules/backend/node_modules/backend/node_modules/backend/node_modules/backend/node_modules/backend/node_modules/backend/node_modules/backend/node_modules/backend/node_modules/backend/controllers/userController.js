const pool = require('../config/db');

const userController = {
    createUser: async (req, res) => {
        try {
            const { uid, email, password } = req.body;
            
            // Check if user already exists
            const [existing] = await pool.query('SELECT * FROM users WHERE uid = ? OR email = ?', [uid, email]);
            if (existing.length > 0) {
                return res.status(409).json({ message: 'User already exists' });
            }

            // Insert new user
            const [result] = await pool.query(
                'INSERT INTO users (uid, email, password) VALUES (?, ?, ?)',
                [uid, email, password]
            );
            
            res.status(201).json({ 
                uid, 
                email,
                message: 'User created successfully' 
            });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ message: error.message });
        }
    },
    updatePassword: async (req, res) => {
        try {
            const { uid } = req.params;
            const { password } = req.body;
    
            console.log('Updating password for uid:', uid); // Debug log
    
            if (!password) {
                console.log('No password provided');
                return res.status(400).json({ 
                    message: 'Password is required',
                    uid: uid 
                });
            }
    
            // First check if user exists
            const [userRows] = await pool.query('SELECT * FROM users WHERE uid = ?', [uid]);
            if (userRows.length === 0) {
                console.log('User not found:', uid);
                return res.status(404).json({ 
                    message: 'User not found',
                    uid: uid 
                });
            }
    
            // Update password with explicit column names
            const [result] = await pool.query(
                'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE uid = ?',
                [password, uid]
            );
    
            if (result.affectedRows === 0) {
                console.log('Update failed - no rows affected');
                return res.status(500).json({ 
                    message: 'Password update failed',
                    error: 'No rows were updated',
                    uid: uid
                });
            }
    
            console.log('Password updated successfully for uid:', uid);
            res.status(200).json({ 
                message: 'Password updated successfully',
                uid: uid,
                affectedRows: result.affectedRows
            });
    
        } catch (error) {
            console.error('Error updating password:', error);
            res.status(500).json({ 
                message: 'Failed to update password in database',
                error: error.message,
                uid: req.params.uid 
            });
        }
    },
    getUserByUid: async (req, res) => {
        try {
            const [rows] = await pool.query(
                'SELECT uid, email FROM users WHERE uid = ?', 
                [req.params.uid]
            );
            
            if (rows.length > 0) {
                res.json(rows[0]);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: error.message });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const { uid } = req.params;
            const { username, email, bio, preferences } = req.body;
            
            // Check if profile exists
            const [existing] = await pool.query('SELECT * FROM profiles WHERE uid = ?', [uid]);
            
            if (existing.length > 0) {
                // Update existing profile
                await pool.query(
                    'UPDATE profiles SET username = ?, email = ?, bio = ?, preferences = ? WHERE uid = ?',
                    [username, email, bio, preferences, uid]
                );
            } else {
                // Create new profile
                await pool.query(
                    'INSERT INTO profiles (uid, username, email, bio, preferences) VALUES (?, ?, ?, ?, ?)',
                    [uid, username, email, bio, preferences]
                );
            }
            
            res.status(200).json({ 
                message: 'Profile updated successfully',
                profile: { uid, username, email, bio, preferences }
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ message: error.message });
        }
    },

    getProfile: async (req, res) => {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM profiles WHERE uid = ?',
                [req.params.uid]
            );
            
            if (rows.length > 0) {
                res.json(rows[0]);
            } else {
                res.status(404).json({ message: 'Profile not found' });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            res.status(500).json({ message: error.message });
        }
    }

};

module.exports = userController;