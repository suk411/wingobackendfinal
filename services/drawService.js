const { redis } = require('../db/redis');

const BETTING_PERIOD_MS = 25000;
const ROUND_DURATION_MS = 30000;
const KEY_PREFIX = 'wingo:draw:';
const HISTORY_KEY = 'wingo:draw:history';

async function drawResult(issueNumber) {
  const existing = await redis.get(`${KEY_PREFIX}${issueNumber}`);
  if (existing !== null) {
    return parseInt(existing);
  }

  const number = Math.floor(Math.random() * 10);
  
  await redis.set(`${KEY_PREFIX}${issueNumber}`, String(number), 'EX', 86400);
  
  await redis.lpush(HISTORY_KEY, JSON.stringify({ issueNumber, number }));
  await redis.ltrim(HISTORY_KEY, 0, 999);

  return number;
}

async function getResultByIssue(issueNumber) {
  const cached = await redis.get(`${KEY_PREFIX}${issueNumber}`);
  if (cached !== null) {
    return parseInt(cached);
  }
  return null;
}

async function getDrawHistory(limit = 10, page = 1) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;
  
  const results = await redis.lrange(HISTORY_KEY, start, end);
  const total = await redis.llen(HISTORY_KEY);
  
  return {
    list: results.map(r => JSON.parse(r)),
    pageNo: page,
    totalPage: Math.ceil(total / limit),
    totalCount: total,
  };
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
};