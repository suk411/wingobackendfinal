const express = require('express');
const router = express.Router();
const { getRoundData } = require('../services/roundService');
const { getDrawHistory } = require('../services/drawService');

router.get('/WinGo_30S.json', async (req, res) => {
  try {
    const roundData = await getRoundData();
    res.json(roundData);
  } catch (err) {
    console.error('Error getting round data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/GetHistoryIssuePage.json', async (req, res) => {
  try {
    const page = parseInt(req.query.pageNo) || 1;
    const limit = 10;
    const history = await getDrawHistory(limit, page);
    
    res.json({
      data: history,
      code: 0,
      msg: 'Succeed',
      msgCode: 0,
      serviceTime: Date.now(),
    });
  } catch (err) {
    console.error('Error getting history:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;