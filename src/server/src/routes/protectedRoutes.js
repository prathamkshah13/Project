const express = require('express');
require('dotenv').config({ path: '.env' });
const jwt = require('jsonwebtoken');

const router = express.Router();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401); // if there isn't any token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: "You have accessed a protected endpoint!", user: req.user });
  });

module.exports = router;

// router.get('/protected', (req, res) => {
//     res.send('Protected Route');
// });