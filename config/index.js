require('dotenv').config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  mongoUri: process.env.MONGO_URI,
  redisUrl: process.env.REDIS_URL,
  jwtSecret: process.env.JWT_SECRET,
  adminKey: process.env.ADMIN_KEY,
  balanceApiUrl: process.env.BALANCE_API_URL || 'https://backend-ledger-0ra6.onrender.com/api/account/balance',
};