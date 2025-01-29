CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  oauth_id VARCHAR(255),
  oauth_provider VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE memberships (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert book details
INSERT INTO books (title, author, description, price) VALUES (
  'The Philosophy of Ma\'at and the Resurrection of Wosir',
  'Iemhotep Sa\'Ra, edited and artwork by Akhenaten Al Hamim',
  'A profound exploration of the principles of Ma\'at and the journey of Wosir, offering insights into personal and collective betterment.',
  20.00
);
