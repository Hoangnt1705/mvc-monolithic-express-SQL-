const mysql = require('mysql2');
const pool = mysql.createPool({ host: 'localhost', user: 'root', password: 'Baitulong1@', database: 'bookstore_schema' });
const db = pool.promise();
module.exports.db = db;