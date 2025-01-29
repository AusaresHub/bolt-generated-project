const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createUser = async (email, name, oauthId, oauthProvider) => {
  const query = 'INSERT INTO users (email, name, oauth_id, oauth_provider) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [email, name, oauthId, oauthProvider];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getUserByOAuthId = async (oauthId, oauthProvider) => {
  const query = 'SELECT * FROM users WHERE oauth_id = $1 AND oauth_provider = $2';
  const values = [oauthId, oauthProvider];
  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = { createUser, getUserByEmail, getUserByOAuthId };
