const { getPreviousIssueNumber } = require('./roundService');
const { drawResult } = require('./drawService');
const { redis } = require('../db/redis');

const BETTING_CLOSE_KEY = 'wingo:lastDraw';

async function checkAndDraw() {
  try {
    const lastDraw = await redis.get(BETTING_CLOSE_KEY);
    const now = Date.now();
    const roundEnd = Math.floor(now / 30000) * 30000;
    
    if (String(roundEnd) !== lastDraw) {
      const { getCurrentIssueNumber } = require('./roundService');
      const currentIssue = await getCurrentIssueNumber();
      const prevIssue = await getPreviousIssueNumber(currentIssue);
      
      if (prevIssue) {
        await drawResult(prevIssue);
      }
      
      await redis.set(BETTING_CLOSE_KEY, String(roundEnd));
    }
  } catch (err) {
    console.error('Draw scheduler error:', err.message);
  }
}

function startScheduler() {
  setInterval(checkAndDraw, 1000);
  console.log('Draw scheduler started');
}

module.exports = { startScheduler, checkAndDraw };