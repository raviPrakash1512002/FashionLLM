// backend/config/mongodb.config.js
const mongoose = require('mongoose');
const zaraConfig = {
  url: 'mongodb://localhost:27017/zara_fashion',
  database:'zara_fashion'
};

const createMongoConnection = async () => {
  try {
    const connection=await mongoose.connect(zaraConfig.url);
    console.log('MongoDB connected to Zara database on port 27017');
    return connection.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports = {
  zaraConfig,
  createMongoConnection
};