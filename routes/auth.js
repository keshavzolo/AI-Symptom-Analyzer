const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { createToken, authRequired } = require('../middleware/auth');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  const user = await User.findOne({ username: username.trim() });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) return res.status(401).json({ message: 'Invalid credentials' });

  const token = createToken(user.username);
  return res.json({ token, username: user.username });
});

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  const normalizedUsername = username.trim();
  if (normalizedUsername.length < 3) return res.status(400).json({ message: 'Username must be at least 3 characters' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

  const existingUser = await User.findOne({ username: normalizedUsername });
  if (existingUser) return res.status(409).json({ message: 'Username already exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username: normalizedUsername, passwordHash });

  const token = createToken(user.username);
  return res.status(201).json({ token, username: user.username, message: 'Signup successful' });
});

router.post('/logout', (_req, res) => {
  return res.json({ message: 'Logged out' });
});

router.get('/auth/me', authRequired, (req, res) => {
  return res.json({ username: req.user.username });
});

module.exports = router;
