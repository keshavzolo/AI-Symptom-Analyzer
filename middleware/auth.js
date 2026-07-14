const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'replace-this-in-production';

function createToken(username) {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
}

async function getUserFromRequest(req) {
  return User.findOne({ username: req.user.username });
}

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = { createToken, authRequired, getUserFromRequest };
