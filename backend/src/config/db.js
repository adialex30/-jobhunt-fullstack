const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const dbUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

const pool = dbUrl
  ? mysql.createPool(dbUrl)
  : mysql.createPool({
      host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
      port: Number(process.env.DB_PORT || process.env.MYSQLPORT) || 3306,
      user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
      password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
      database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'jobhunt_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

(async () => {
  try {
    const connection = await pool.getConnection();
    const dbTarget = process.env.DB_NAME || process.env.MYSQLDATABASE || (dbUrl ? 'Remote URL' : 'jobhunt_db');
    console.log('Connected to Database:', dbTarget);
    connection.release();
  } catch (error) {
    console.error('Database connection error:', error.message);
  }
})();
module.exports = pool;
