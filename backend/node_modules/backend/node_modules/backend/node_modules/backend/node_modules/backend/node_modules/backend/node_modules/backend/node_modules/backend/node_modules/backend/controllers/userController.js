const pool = require('../config/db');

const userController = {
    createUser: async (req, res) => {
        try {
            const { uid, username, email } = req.body;
            const [result] = await pool.query(
                'INSERT INTO users (uid, username, email) VALUES (?, ?, ?)',
                [uid, username, email]
            );
            res.status(201).json({ uid, username, email });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getUserByUid: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE uid = ?', [req.params.uid]);
            if (rows.length > 0) {
                res.json(rows[0]);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = userController;