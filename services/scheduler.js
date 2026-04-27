const { getCurrentIssueNumber } = require('./roundService');
const { drawResult } = require('./drawService');
const { redis } = require('../db/redis');

const BETTING_CLOSE_KEY = 'wingo:lastDraw';

async function checkAndDraw() {
  try {
    const lastDraw = await redis.get(BETTING_CLOSE_KEY);
    const now = Date.now();
    const roundEnd = Math.floor(now / 30000) * 30000;
    
    if (String(roundEnd) !== lastDraw) {
      const prevIssue = await getPreviousIssueForTime(roundEnd);
      
      if (prevIssue) {
        await drawResult(prevIssue);
      }
      
      await redis.set(BETTING_CLOSE_KEY, String(roundEnd));
    }
  } catch (err) {
    console.error('Draw scheduler error:', err.message);
  }
}

async function getPreviousIssueForTime(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const basePart = `${year}${month}${day}`;
  const seqKey = `wingo:round:sequence:${basePart}`;
  
  let seq = await redis.get(seqKey);
  if (!seq) return null;
  
  const seqNum = parseInt(seq) - 1;
  if (seqNum < 1) return null;
  
  return `${basePart}${String(seqNum).padStart(5, '0')}`;
}

function startScheduler() {
  setInterval(checkAndDraw, 1000);
  console.log('Draw scheduler started');
}

module.exports = { startScheduler, checkAndDraw };