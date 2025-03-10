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
    }
};

module.exports = userController;