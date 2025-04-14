# Flomo 增强工具

这个增强工具可以在不修改原始 `cubxxw.html` 文件的情况下，为 Flomo 笔记添加多种实用功能。

## 使用方法

### 本地开发环境

使用项目的主服务器运行：

```bash
# 在项目根目录运行
make dev
# 或
npm run dev
```

然后访问以下URL：
- 项目主页: http://localhost:3000/
- Flomo 增强版: http://localhost:3000/flomo-enhanced
- Flomo 原始版: http://localhost:3000/flomo-original

### 直接访问文件

直接打开 `enhancer.html` 文件，它会自动加载原始的 Flomo 笔记并应用增强功能。

## 新增功能

### 1. 搜索功能

- 页面顶部添加了搜索框，可以快速搜索笔记内容
- 支持实时高亮显示搜索结果
- 提供重置搜索功能

### 2. 暗黑模式

- 右上角添加了暗黑模式切换按钮（🌙）
- 适合夜间阅读，保护眼睛

### 3. 标签云

- 自动收集笔记中的所有标签
- 点击标签可以快速筛选相关笔记

### 4. 排版优化

- 优化了笔记展示的样式
- 添加响应式设计，适配不同屏幕大小
- 改进阅读体验

### 5. 便捷功能

- 添加回到顶部按钮
- 提供原始视图切换选项

## 技术实现

本增强工具使用纯 JavaScript 实现，通过以下方式工作：

1. `enhancer.html` 使用 iframe 嵌入原始的 `cubxxw.html`
2. 通过 `flomo-enhancer.js` 动态注入额外功能
3. 使用 DOM 操作添加界面元素
4. 使用内联样式确保兼容性

## 兼容性

支持所有现代浏览器，包括：
- Chrome
- Firefox
- Safari
- Edge

## 本地使用

由于浏览器安全限制，如果您通过本地文件系统直接打开这些文件，某些功能可能不可用。建议：

1. 使用项目自带的服务器（推荐）：
   ```bash
   make dev
   ```
   
2. 或使用其他简单的本地服务器：
   - Python: `python -m http.server`
   - Node.js: `npx http-server`

## 浏览器扩展使用

如果想在任何地方使用增强功能，可以通过浏览器扩展的方式：

1. 安装 Tampermonkey 浏览器扩展
2. 添加 `flomo-enhancer.user.js` 用户脚本
3. 访问 cubxxw.html 时会自动应用增强功能 