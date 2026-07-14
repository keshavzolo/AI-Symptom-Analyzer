const express = require('express');
const router = express.Router();
const SearchHistory = require('../models/searchHistory');
const { authRequired } = require('../middleware/auth');

router.get('/history', authRequired, async (req, res) => {
  try {
    const history = await SearchHistory.find({ username: req.user.username })
      .sort({ createdAt: -1 })
      .limit(30)
      .select('searchType query reply createdAt');

    return res.json({ history });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch history' });
  }
});

module.exports = router;
