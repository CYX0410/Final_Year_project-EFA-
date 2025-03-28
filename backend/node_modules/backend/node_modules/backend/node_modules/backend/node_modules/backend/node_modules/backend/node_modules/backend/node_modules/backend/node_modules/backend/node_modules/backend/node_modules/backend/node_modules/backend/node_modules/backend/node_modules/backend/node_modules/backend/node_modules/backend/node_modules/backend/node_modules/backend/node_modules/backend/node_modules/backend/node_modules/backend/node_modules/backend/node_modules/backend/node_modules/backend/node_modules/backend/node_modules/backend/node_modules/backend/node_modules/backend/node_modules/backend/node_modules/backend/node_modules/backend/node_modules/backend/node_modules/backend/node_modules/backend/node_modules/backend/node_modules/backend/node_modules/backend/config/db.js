// config/db.js
require('dotenv').config();
const mysql = require('mysql2/promise');


const mySqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000
});
async function testConnection() {
    try {
        const connection = await mySqlPool.getConnection();
        console.log('Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
}

testConnection();
module.exports = mySqlPool;