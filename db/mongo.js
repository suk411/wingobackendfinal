require('dotenv').config();

const dns = require('dns');
const mongoose = require('mongoose');
const config = require('../config');

dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4", "1.0.0.1"]);

const connectDB = async () => {
  if (!config.mongoUri) {
    console.log('MongoDB URI not configured, skipping MongoDB connection');
    return;
  }
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
};

module.exports = { connectDB };