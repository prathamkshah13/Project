const express = require('express');
const pool = require('./db');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });
app.use(express.json()); // middleware for parsing JSON bodies

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/api/protected', authenticateToken, (req, res, next) => {
  res.json({ message: "You have accessed a protected endpoint!", user: req.user });
});


app.get('/profile', (req, res) => {
  res.send('Response from GET request');
});

// Route to get all users
app.get('/users', async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM users');
    res.json(results.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Route to authenticate a user
app.post('/api/login', async (req, res, next) => {
    console.log(`Received ${req.method} request at ${req.url}`);
    try {
      console.log(req.body);
      const { email, password } = req.body;
      const user = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
  
      if (user.rows.length > 0) {
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
          res.status(400).json('Invalid Password');
        } else {
          res.json('Logged In!');
        }
      } else {
        res.status(400).json('User Not Found');
      }
    } catch (err) {
      console.error(err.message);
      next(err); // Pass the error to the error handling middleware
    }
  });

// Start the server
const port = process.env.PORT || 5000;
console.log("This is the port", port);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

