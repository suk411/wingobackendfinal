const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  gameCode: { type: String, required: true },
  issueNumber: { type: String, required: true },
  selectType: { type: String, required: true },
  selectValue: { type: String, required: true },
  amount: { type: Number, required: true },
  realAmount: { type: Number, required: true },
  multiplier: { type: Number, default: 0 },
  payout: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'won', 'lost'], default: 'pending' },
  result: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
});

betSchema.index({ issueNumber: 1 });
betSchema.index({ userId: 1 });

module.exports = mongoose.model('Bet', betSchema);