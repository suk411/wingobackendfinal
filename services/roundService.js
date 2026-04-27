const { redis } = require('../db/redis');

const ROUND_DURATION_MS = 30000;
const KEY_PREFIX = 'wingo:round:';

async function getCurrentIssueNumber() {
  const now = Date.now();
  const date = new Date(now);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  const basePart = `${year}${month}${day}${hours}${minutes}${seconds}`;
  const sequenceKey = `${KEY_PREFIX}sequence:${basePart}`;
  
  let sequence = await redis.get(sequenceKey);
  if (!sequence) {
    sequence = '1';
    await redis.set(sequenceKey, sequence, 'EX', 3600);
  } else {
    const currentSecond = Math.floor(now / 1000);
    const storedSecond = await redis.get(`${KEY_PREFIX}second`);
    if (storedSecond != currentSecond) {
      sequence = '1';
      await redis.set(sequenceKey, sequence, 'EX', 3600);
      await redis.set(`${KEY_PREFIX}second`, currentSecond);
    }
  }
  
  return `${basePart}${sequence.padStart(5, '0')}`;
}

async function getRoundData() {
  const now = Date.now();
  const roundStart = Math.floor(now / ROUND_DURATION_MS) * ROUND_DURATION_MS;
  const roundEnd = roundStart + ROUND_DURATION_MS;
  const nextRoundStart = roundEnd;
  const nextRoundEnd = nextRoundStart + ROUND_DURATION_MS;
  const prevRoundStart = roundStart - ROUND_DURATION_MS;
  const prevRoundEnd = roundStart;
  
  const currentIssue = await getCurrentIssueNumber();
  const prevIssue = await getPreviousIssueNumber(currentIssue);
  const nextIssue = await getNextIssueNumber(currentIssue);
  
  return {
    gameCode: 'WinGo_30S',
    intervalMinute: 0.5,
    state: 1,
    previous: {
      issueNumber: prevIssue,
      startTime: prevRoundStart,
      endTime: prevRoundEnd,
    },
    current: {
      issueNumber: currentIssue,
      startTime: roundStart,
      endTime: roundEnd,
    },
    next: {
      issueNumber: nextIssue,
      startTime: nextRoundStart,
      endTime: nextRoundEnd,
    },
  };
}

async function getPreviousIssueNumber(currentIssue) {
  const seq = parseInt(currentIssue.slice(-5)) - 1;
  if (seq < 1) {
    const prevDate = new Date(Date.now() - ROUND_DURATION_MS);
    return generateIssueNumber(prevDate, '99999');
  }
  return currentIssue.slice(0, -5) + String(seq).padStart(5, '0');
}

async function getNextIssueNumber(currentIssue) {
  const seq = parseInt(currentIssue.slice(-5)) + 1;
  return currentIssue.slice(0, -5) + String(seq).padStart(5, '0');
}

function generateIssueNumber(date, sequence) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}${sequence.padStart(5, '0')}`;
}

module.exports = {
  getRoundData,
  ROUND_DURATION_MS,
};