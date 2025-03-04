// controllers/userController.js
const pool = require('../config/db');

const userController = {
    getAllUsers: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM users');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    createUser: async (req, res) => {
        try {
            const { name, email } = req.body;
            const [result] = await pool.query(
                'INSERT INTO users (name, email) VALUES (?, ?)',
                [name, email]
            );
            res.status(201).json({ id: result.insertId, name, email });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = userController;