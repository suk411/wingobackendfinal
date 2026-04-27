const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  issueNumber: { type: String, required: true, unique: true },
  number: { type: Number, required: true, min: 0, max: 9 },
  createdAt: { type: Date, default: Date.now },
});

resultSchema.index({ issueNumber: -1 });
resultSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Result', resultSchema);