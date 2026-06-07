require('dotenv').config();
const mysql = require('mysql2/promise');
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

connection.query('SELECT 1').then(() => console.log("Connected"))
    .catch(err => console.log("Error", err));


module.exports = connection;