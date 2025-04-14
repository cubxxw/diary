const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression()); // Compress responses
app.use(cors()); // Enable CORS

// 添加flomo增强版专用路由 - 把这些路由放在静态文件服务前面
app.get('/flomo-enhanced', (req, res) => {
  res.sendFile(path.join(__dirname, 'flomo', 'enhancer.html'));
});

// 添加flomo原始版专用路由
app.get('/flomo-original', (req, res) => {
  res.sendFile(path.join(__dirname, 'flomo', 'cubxxw.html'));
});

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));
app.use('/flomo', express.static(path.join(__dirname, 'flomo')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`主页: http://localhost:${PORT}/`);
  console.log(`Flomo 增强版: http://localhost:${PORT}/flomo-enhanced`);
  console.log(`Flomo 原始版: http://localhost:${PORT}/flomo-original`);
  console.log(`Flomo 目录: http://localhost:${PORT}/flomo/`);
});