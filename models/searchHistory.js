const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    username: { type: String, required: true },
    searchType: { type: String, enum: ['text', 'image'], required: true },
    query: { type: String, required: true },
    reply: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
