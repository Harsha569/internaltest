
const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  url: { type: String, required: true },
  date: { type: Date, default: Date.now },
  notes: String,
  tags: [String],
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
