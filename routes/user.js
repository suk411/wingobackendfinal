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
    return res.status(401).json({ msg: 'Invalid token' });
  }
}

router.get('/user', verifyToken, async (req, res) => {
  try {
    const response = await axios.get(
      'https://backend-ledger-0ra6.onrender.com/api/account/balance',
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