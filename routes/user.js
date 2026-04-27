const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: 'No token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verify error:', err.message, 'Secret:', config.jwtSecret ? 'loaded' : 'MISSING');
    return res.status(401).json({ msg: 'Invalid token' });
  }
}

router.get('/user', verifyToken, async (req, res) => {
  try {
    const response = await axios.get(
      config.balanceApiUrl,
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );

    res.json({
      userId: req.user.userId,
      balance: response.data.balance
    });

  } catch (err) {
    res.status(500).json({
      msg: 'Failed to fetch user data',
      error: err.message
    });
  }
});

module.exports = router;