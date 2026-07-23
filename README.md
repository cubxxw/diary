# Diary - AI Enhanced Notes

A modern web application that enhances flomo's exported notes with AI capabilities and a beautiful user interface.

[![Netlify Status](https://api.netlify.com/api/v1/badges/6aefdc6a-37cb-481e-b48c-4151b3c31ec5/deploy-status)](https://app.netlify.com/sites/diarys/deploys)

## Features

- 🔍 **强大搜索** - 快速搜索笔记内容，高亮显示结果
- 🌙 **暗黑模式** - 一键切换明暗主题，护眼阅读
- 🏷️ **标签云** - 自动收集并展示标签，快速筛选内容
- 📱 **响应式设计** - 自适应各种屏幕尺寸
- 🚀 **性能优化** - 快速加载，流畅体验
- ⚙️ **便捷功能** - 回到顶部，原始/增强视图切换

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/cubxxw/diary.git
   cd diary
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the server
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

- **主页**: http://localhost:3000/
- **Flomo 增强版**: http://localhost:3000/flomo-enhanced 
- **Flomo 原始版**: http://localhost:3000/flomo-original

### 增强版特性

增强版 Flomo 保持原始 HTML 文件不变，通过外部 JavaScript 添加功能：

1. **强大搜索**
   - 实时搜索笔记内容
   - 高亮显示搜索结果
   - 支持重置搜索

2. **暗黑模式**
   - 一键切换明暗主题
   - 夜间阅读更护眼

3. **标签云**
   - 自动收集笔记中的标签
   - 点击筛选相关内容

4. **排版优化**
   - 响应式设计
   - 优化字体和间距

5. **便捷功能**
   - 回到顶部按钮
   - 原始/增强视图切换

## Technology

本项目使用纯 JavaScript 实现增强功能，主要通过以下方式：

- iframe 嵌套方式保持原始文件不变
- DOM 操作添加界面元素
- 动态样式注入
- 事件监听实现交互

## Links

- [GitHub Repository](https://github.com/cubxxw/diary)
- [Personal Blog](https://cubxxw.com)

## License

MIT License

