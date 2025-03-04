const mysql = require('mysql2/promise');

const mySqlPool = mysql.createPool({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'ACE375!*!cyx',
    database: 'eco_dataset'
})

module.exports = mySqlPool; ;