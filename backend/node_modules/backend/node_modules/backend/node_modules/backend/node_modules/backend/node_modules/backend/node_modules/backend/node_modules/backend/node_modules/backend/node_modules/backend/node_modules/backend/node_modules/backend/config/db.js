// config/db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'db',           // Matches the service name in docker-compose.yml
    port: 3306,           // Internal port inside the Docker network
    user: 'root',
    password: 'ACE375!*!cyx',
    database: 'eco_dataset',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};
console.log('DB_HOST:', dbConfig.host);
console.log('DB_PORT:', dbConfig.port);
console.log('DB_USER:', dbConfig.user);
console.log('DB_PASSWORD:', dbConfig.password);
console.log('DB_NAME:', dbConfig.database);

const mySqlPool = mysql.createPool(dbConfig);

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