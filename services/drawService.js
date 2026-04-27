const mongoose = require('mongoose');
const { redis } = require('../db/redis');

const resultSchema = new mongoose.Schema({
  issueNumber: { type: String, required: true, unique: true },
  number: { type: Number, required: true, min: 0, max: 9 },
  createdAt: { type: Date, default: Date.now },
});

const Result = mongoose.models.Result || mongoose.model('Result', resultSchema);

const BETTING_PERIOD_MS = 25000;
const ROUND_DURATION_MS = 30000;
const KEY_PREFIX = 'wingo:draw:';
const HISTORY_KEY = 'wingo:draw:history';
const CACHE_LIMIT = 10;

async function drawResult(issueNumber) {
  const existing = await redis.get(`${KEY_PREFIX}${issueNumber}`);
  if (existing !== null) {
    return parseInt(existing);
  }

  const number = Math.floor(Math.random() * 10);
  
  await redis.set(`${KEY_PREFIX}${issueNumber}`, String(number), 'EX', 86400);
  
  await redis.lpush(HISTORY_KEY, JSON.stringify({ issueNumber, number }));
  await redis.ltrim(HISTORY_KEY, 0, CACHE_LIMIT - 1);

  try {
    await Result.create({ issueNumber, number });
  } catch (err) {
    if (err.code !== 11000) console.error('MongoDB save error:', err.message);
  }

  return number;
}

async function getResultByIssue(issueNumber) {
  const cached = await redis.get(`${KEY_PREFIX}${issueNumber}`);
  if (cached !== null) {
    return parseInt(cached);
  }

  try {
    const result = await Result.findOne({ issueNumber });
    if (result) {
      await redis.set(KEY_PREFIX + issueNumber, String(result.number), 'EX', 86400);
      return result.number;
    }
  } catch (err) {
    console.error('MongoDB read error:', err.message);
  }

  return null;
}

async function getDrawHistory(limit = 10, page = 1) {
  const skip = (page - 1) * limit;
  
  try {
    const [mongoResults, total] = await Promise.all([
      Result.find().sort({ issueNumber: -1 }).skip(skip).limit(limit).lean(),
      Result.countDocuments(),
    ]);
    
    let results = mongoResults.map(r => JSON.stringify({ issueNumber: r.issueNumber, number: r.number }));
    let list = results.map(r => JSON.parse(r));
    
    if (page === 1 && mongoResults.length > 0) {
      for (const r of mongoResults.slice(0, CACHE_LIMIT)) {
        await redis.lpush(HISTORY_KEY, JSON.stringify({ issueNumber: r.issueNumber, number: r.number }));
      }
      await redis.ltrim(HISTORY_KEY, 0, CACHE_LIMIT - 1);
    }
    
    return {
      list,
      pageNo: page,
      totalPage: Math.ceil(total / limit),
      totalCount: total,
    };
  } catch (err) {
    console.error('MongoDB read error:', err.message);
    return {
      list: [],
      pageNo: page,
      totalPage: 0,
      totalCount: 0,
    };
  }
}

function isInDrawPeriod() {
  const now = Date.now();
  const positionInRound = now % ROUND_DURATION_MS;
  return positionInRound >= BETTING_PERIOD_MS;
}

module.exports = {
  drawResult,
  getResultByIssue,
  getDrawHistory,
  isInDrawPeriod,
  BETTING_PERIOD_MS,
  ROUND_DURATION_MS,
  Result,
};