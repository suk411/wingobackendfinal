const express = require('express');
const cors = require('cors');
const config = require('./config');
const { connectDB } = require('./db/mongo');
const { redis } = require('./db/redis');
const winGoRoutes = require('./routes/winGo');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/WinGo', winGoRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const startServer = async () => {
  try {
    await connectDB();
    await redis.connect();
    
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;