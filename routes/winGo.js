const express = require('express');
const router = express.Router();
const { getRoundData } = require('../services/roundService');

router.get('/WinGo_30S.json', async (req, res) => {
  try {
    const roundData = await getRoundData();
    res.json(roundData);
  } catch (err) {
    console.error('Error getting round data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;