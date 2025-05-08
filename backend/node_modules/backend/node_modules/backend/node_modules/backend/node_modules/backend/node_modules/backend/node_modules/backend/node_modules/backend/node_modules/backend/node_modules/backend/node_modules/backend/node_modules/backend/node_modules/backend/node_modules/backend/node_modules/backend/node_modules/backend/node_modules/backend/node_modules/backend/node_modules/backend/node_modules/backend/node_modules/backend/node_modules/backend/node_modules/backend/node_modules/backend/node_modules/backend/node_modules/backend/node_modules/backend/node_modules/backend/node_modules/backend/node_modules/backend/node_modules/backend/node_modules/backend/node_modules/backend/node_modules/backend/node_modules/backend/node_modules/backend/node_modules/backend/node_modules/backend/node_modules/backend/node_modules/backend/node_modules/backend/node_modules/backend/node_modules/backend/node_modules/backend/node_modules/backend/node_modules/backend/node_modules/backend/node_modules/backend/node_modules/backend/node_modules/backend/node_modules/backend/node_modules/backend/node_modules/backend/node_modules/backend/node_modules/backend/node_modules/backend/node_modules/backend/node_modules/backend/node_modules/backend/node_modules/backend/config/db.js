// config/db.js
require('dotenv').config();
const mysql = require('mysql2/promise');


console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('MYSQL_ROOT_PASSWORD:', process.env.MYSQL_ROOT_PASSWORD);
const mySqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.MYSQL_ROOT_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
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