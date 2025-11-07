const { Pool } = require('pg');

const peterEnglandConfig = {
  host: 'localhost',
  port: 5432,
  database: 'peterengland_fashion',
  user: 'postgres',
  password: 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const createPostgreSQLConnection = async (config = peterEnglandConfig) => {
  try {
    const pool = new Pool(config);
    
    await pool.query('SELECT NOW()');
    console.log(`PostgreSQL connected to ${config.database}`);
    
    return pool;
  } catch (error) {
    console.error('PostgreSQL connection failed:', error);
    throw error;
  }
};

module.exports = {
  createPostgreSQLConnection,
  peterEnglandConfig,
};