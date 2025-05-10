const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 连接MongoDB
mongoose.connect('mongodb://localhost:27017/movie-website', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 用户模型
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

const User = mongoose.model('User', userSchema);

// 电影模型
const movieSchema = new mongoose.Schema({
  title: String,
  image: String,
  year: String,
  duration: String,
  rating: Number
});

const Movie = mongoose.model('Movie', movieSchema);

// 注册路由
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: '注册成功' });
  } catch (error) {
    res.status(400).json({ message: '注册失败', error: error.message });
  }
});

// 登录路由
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: '用户不存在' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: '密码错误' });
    }
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: '登录失败', error: error.message });
  }
});

// 添加收藏
app.post('/api/favorites', async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    const user = await User.findById(userId);
    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
      await user.save();
    }
    res.json({ message: '收藏成功' });
  } catch (error) {
    res.status(400).json({ message: '收藏失败', error: error.message });
  }
});

// 获取收藏列表
app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(400).json({ message: '获取收藏失败', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 