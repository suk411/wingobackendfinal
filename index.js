const express = require('express');
const cors = require('cors');
const config = require('./config');
const { connectDB } = require('./db/mongo');
const { redis } = require('./db/redis');
const winGoRoutes = require('./routes/winGo');
const userRoutes = require('./routes/user');
const settleRoutes = require('./routes/settle');
const { startScheduler } = require('./services/scheduler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/WinGo', winGoRoutes);
app.use('/wingo', userRoutes);
app.use('/api/wingo', settleRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const startServer = async () => {
  try {
    await connectDB();
    await redis.connect();
    startScheduler();
    
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