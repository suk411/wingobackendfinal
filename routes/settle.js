const express = require('express');
const router = express.Router();
const Bet = require('../models/Bet');
const { getNumberColor, checkWin, getMultiplier } = require('../services/betLogic');
const config = require('../config');

function verifyApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ status: 'failed', msg: 'API key is required' });
  }

  if (apiKey !== config.wingoApiKey) {
    return res.status(403).json({ status: 'failed', msg: 'Invalid API key' });
  }

  next();
}

router.post('/settle', verifyApiKey, async (req, res) => {
  try {
    const { issueNumber, result } = req.body;

    if (!issueNumber || !result || result.number === undefined) {
      return res.status(400).json({ status: 'failed', msg: 'issueNumber and result.number are required' });
    }

    const number = parseInt(result.number);
    const colour = getNumberColor(number);
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const bets = await Bet.find({ issueNumber, status: 'pending' });

    let settled = 0;
    let totalPayout = 0;

    for (const bet of bets) {
      const multiplier = getMultiplier(bet.selectType, bet.selectValue, number);

      if (checkWin(bet.selectType, bet.selectValue, number)) {
        const payout = bet.realAmount * multiplier;

        bet.status = 'won';
        bet.result = number;
        bet.multiplier = multiplier;
        bet.payout = payout;
        await bet.save();

        totalPayout += payout;
      } else {
        bet.status = 'lost';
        bet.result = number;
        bet.multiplier = 0;
        bet.payout = 0;
        await bet.save();
      }

      settled++;
    }

    res.json({
      status: 'success',
      msg: 'Bets settled successfully',
      settled,
      totalPayout: parseFloat(totalPayout.toFixed(2)),
      result: {
        number: String(number),
        colour,
        timestamp,
      },
    });

  } catch (err) {
    console.error('Settle error:', err.message);
    res.status(500).json({ status: 'failed', msg: 'Internal server error' });
  }
});

module.exports = router;