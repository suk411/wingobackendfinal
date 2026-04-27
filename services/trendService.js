const { redis } = require('../db/redis');

const HISTORY_KEY = 'wingo:draw:history';
const STATS_KEY = 'wingo:trend:stats';
const SAMPLE_SIZE = 100;

async function getTrendStatistics() {
  const cached = await redis.get(STATS_KEY);
  if (cached !== null) {
    return JSON.parse(cached);
  }

  const results = await redis.lrange(HISTORY_KEY, 0, SAMPLE_SIZE - 1);
  const history = results.map(r => JSON.parse(r)).reverse();

  const stats = calculateStats(history);

  await redis.set(STATS_KEY, JSON.stringify(stats), 'EX', 30);

  return stats;
}

function calculateStats(history) {
  const stats = [];

  for (let num = 0; num <= 9; num++) {
    const positions = [];
    history.forEach((r, idx) => {
      if (r.number === num) positions.push(idx);
    });

    const openCount = positions.length;
    const missingCount = openCount === 0 ? history.length : history.length - 1 - positions[0];
    const avgMissing = openCount > 0 ? Math.round(history.length / openCount) : 0;
    const maxContinuous = calculateMaxContinuous(positions);

    stats.push({
      number: num,
      missingCount,
      avgMissing,
      openCount,
      maxContinuous,
    });
  }

  return stats;
}

function calculateMaxContinuous(positions) {
  if (positions.length < 2) return positions.length;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < positions.length; i++) {
    if (positions[i] - positions[i - 1] === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

module.exports = { getTrendStatistics };