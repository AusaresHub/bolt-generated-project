const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createMembership = async (userId) => {
  const query = 'INSERT INTO memberships (user_id) VALUES ($1) RETURNING *';
  const values = [userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getMembershipByUserId = async (userId) => {
  const query = 'SELECT * FROM memberships WHERE user_id = $1';
  const values = [userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = { createMembership, getMembershipByUserId };
