const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const getBookDetails = async () => {
  const query = 'SELECT * FROM books WHERE id = 1';
  const result = await pool.query(query);
  return result.rows[0];
};

module.exports = { getBookDetails };
