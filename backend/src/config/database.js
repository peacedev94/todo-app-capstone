const { Pool } = require('pg');

// Configure SSL based on environment and DB_SSL setting
const getSSLConfig = () => {
  if (process.env.DB_SSL === 'true') {
    return {
      rejectUnauthorized: false,
      require: true
    };
  }
  
  if (process.env.NODE_ENV === 'production') {
    return {
      rejectUnauthorized: false,
      require: true
    };
  }
  
  return false;
};

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: getSSLConfig(),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const connectDB = async () => {
  try {
    // Test the connection
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    client.release(); // Release the test connection
    
    // Create tables if they don't exist
    await createTables();
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

const createTables = async () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createTodosTable = `
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT FALSE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await pool.query(createUsersTable);
    await pool.query(createTodosTable);
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

module.exports = { pool, connectDB };

// const { Pool } = require('pg');

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT || 5432,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// });

// const connectDB = async () => {
//   try {
//     await pool.connect();
//     console.log('Connected to PostgreSQL database');
    
//     // Create tables if they don't exist
//     await createTables();
//   } catch (error) {
//     console.error('Database connection error:', error);
//     throw error;
//   }
// };

// const createTables = async () => {
//   const createUsersTable = `
//     CREATE TABLE IF NOT EXISTS users (
//       id SERIAL PRIMARY KEY,
//       email VARCHAR(255) UNIQUE NOT NULL,
//       password VARCHAR(255) NOT NULL,
//       name VARCHAR(255) NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `;

//   const createTodosTable = `
//     CREATE TABLE IF NOT EXISTS todos (
//       id SERIAL PRIMARY KEY,
//       title VARCHAR(255) NOT NULL,
//       description TEXT,
//       completed BOOLEAN DEFAULT FALSE,
//       user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `;

//   try {
//     await pool.query(createUsersTable);
//     await pool.query(createTodosTable);
//     console.log('Database tables created successfully');
//   } catch (error) {
//     console.error('Error creating tables:', error);
//     throw error;
//   }
// };

// module.exports = { pool, connectDB };
