const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  favorites: [String]  // 儲存影片 ID
});

module.exports = mongoose.model('User', userSchema);
