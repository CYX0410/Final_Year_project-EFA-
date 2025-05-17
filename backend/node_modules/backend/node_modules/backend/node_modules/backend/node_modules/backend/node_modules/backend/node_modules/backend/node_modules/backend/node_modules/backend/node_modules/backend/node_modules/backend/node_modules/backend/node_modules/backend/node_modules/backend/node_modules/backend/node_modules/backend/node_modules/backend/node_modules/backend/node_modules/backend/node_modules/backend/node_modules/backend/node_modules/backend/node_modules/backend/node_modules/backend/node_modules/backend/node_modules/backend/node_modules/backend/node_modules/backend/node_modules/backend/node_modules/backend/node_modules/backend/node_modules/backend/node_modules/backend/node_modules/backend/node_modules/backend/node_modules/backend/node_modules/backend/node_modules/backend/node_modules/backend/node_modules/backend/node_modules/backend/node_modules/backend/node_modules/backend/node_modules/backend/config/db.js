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

const mySqlPool = mysql.createPool(dbConfig);

async function testConnection() {
    try {
        const connection = await mySqlPool.getConnection();
        console.log('Database connected successfully');

        // Optionally, verify that the challenge_history table exists
        const [tables] = await connection.query(
            "SHOW TABLES LIKE 'challenge_history';"
        );
        if (tables.length === 0) {
            console.error("Table 'challenge_history' does not exist in the database. Ensure the database is initialized with init.sql.");
        } else {
            console.log("Table 'challenge_history' exists.");
        }

        connection.release();
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error; // Rethrow the error to ensure the application fails if the DB isn't ready
    }
}

// Call testConnection to verify the database connection during startup
testConnection().catch((err) => {
    console.error('Failed to initialize database connection:', err);
    process.exit(1); // Exit the process if the DB connection fails
});

module.exports = mySqlPool;