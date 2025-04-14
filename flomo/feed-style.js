// Feed模式样式定义
const feedStyles = `
/* Feed模式容器 */
#feed-mode-interface {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(125deg, rgba(20,20,31,0.95) 0%, rgba(30,30,45,0.95) 100%);
  z-index: 9998;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, sans-serif;
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(10px);
}

/* 当Feed模式激活时，在保持无障碍的情况下视觉隐藏内容 */
body.feed-mode-active .memo-list-container {
  visibility: hidden;
}

/* 保留无障碍信息的隐藏方式 */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 图标样式 */
.feed-icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  margin-right: 5px;
}

/* 卡片容器 */
#feed-card-container {
  width: 90%;
  max-width: 720px;
  height: auto;
  max-height: 80vh;
  position: relative;
  perspective: 1200px;
}

/* 卡片样式 - 现代化设计 */
.feed-card {
  width: 100%;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border-radius: 18px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.18),
    0 0 0 1px rgba(255, 255, 255, 0.08) inset,
    0 -10px 30px rgba(0, 0, 0, 0.05) inset;
  overflow: hidden;
  transform: translateY(20px) rotateX(3deg);
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(220, 220, 220, 0.3);
}

/* 卡片头部 */
.feed-card-header {
  padding: 20px 28px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, rgba(240, 240, 240, 0.2), rgba(250, 250, 250, 0.6));
  backdrop-filter: blur(5px);
}

/* 日期显示 */
.feed-card-date {
  color: #5a6a80;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  letter-spacing: 0.03em;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
}

/* 卡片内容区域 */
.feed-card-content {
  padding: 28px;
  overflow-y: auto;
  max-height: 60vh;
  background: rgba(255, 255, 255, 0.8);
  line-height: 1.75;
}

/* 卡片内容排版优化 */
.feed-card-content p {
  margin: 0 0 18px 0;
  line-height: 1.8;
  font-size: 16px;
  color: #334155;
  letter-spacing: 0.01em;
  font-weight: 400;
}

/* Markdown 优化 */
.feed-card-content h1,
.feed-card-content h2,
.feed-card-content h3,
.feed-card-content h4,
.feed-card-content h5,
.feed-card-content h6 {
  margin-top: 28px;
  margin-bottom: 16px;
  color: #1e293b;
  font-weight: 600;
  line-height: 1.4;
}

.feed-card-content h1 {
  font-size: 24px;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 8px;
}

.feed-card-content h2 {
  font-size: 22px;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 6px;
}

.feed-card-content h3 {
  font-size: 20px;
}

.feed-card-content h4 {
  font-size: 18px;
}

.feed-card-content ul,
.feed-card-content ol {
  padding-left: 22px;
  margin-bottom: 18px;
}

.feed-card-content li {
  margin-bottom: 6px;
}

.feed-card-content blockquote {
  padding: 12px 20px;
  margin: 16px 0;
  border-left: 4px solid #30cf79;
  background-color: rgba(236, 246, 240, 0.8);
  color: #475569;
  font-style: italic;
  border-radius: 0 4px 4px 0;
}

.feed-card-content hr {
  height: 1px;
  background-color: #eaecef;
  border: none;
  margin: 20px 0;
}

.feed-card-content table {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
  overflow-x: auto;
  display: block;
}

.feed-card-content th,
.feed-card-content td {
  border: 1px solid #dfe2e5;
  padding: 8px 12px;
  text-align: left;
}

.feed-card-content th {
  background-color: #f6f8fa;
  font-weight: 600;
}

.feed-card-content tr:nth-child(even) {
  background-color: #f8f9fa;
}

/* 代码块样式优化 */
.feed-card-content pre {
  background-color: #282c34;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin: 16px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.feed-card-content code {
  font-family: "Cascadia Code", "JetBrains Mono", "Fira Code", Consolas, Monaco, 'Andale Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #e4e4e4;
}

/* 在文本中的内联代码 */
.feed-card-content p code,
.feed-card-content li code {
  background-color: rgba(175, 184, 193, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Cascadia Code", "JetBrains Mono", "Fira Code", Consolas, Monaco, 'Andale Mono', monospace;
  font-size: 0.9em;
  color: #476582;
  border: 1px solid rgba(175, 184, 193, 0.2);
}

/* 图片优化 */
.feed-card-content img {
  max-width: 100%;
  border-radius: 8px;
  margin: 16px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feed-card-content img:hover {
  transform: scale(1.02);
}

/* 链接样式优化 */
.feed-card-content a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid rgba(37, 99, 235, 0.3);
  transition: all 0.2s ease;
  padding-bottom: 1px;
}

.feed-card-content a:hover {
  color: #1e40af;
  border-bottom: 1px solid rgba(37, 99, 235, 0.8);
  background-color: rgba(37, 99, 235, 0.05);
}

/* 卡片底部 */
.feed-card-footer {
  padding: 18px 28px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, rgba(245, 245, 245, 0.8), rgba(250, 250, 250, 0.9));
  backdrop-filter: blur(5px);
}

/* 功能按钮容器 */
.feed-actions {
  display: flex;
  gap: 16px;
}

/* 功能按钮 */
.feed-action-btn {
  display: flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: #5a6a80;
  border: none;
  background: transparent;
}

.feed-action-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #30cf79;
  transform: translateY(-2px);
}

.feed-action-btn.active {
  color: #30cf79;
  background: rgba(48, 207, 121, 0.1);
}

/* 标签区域 */
.feed-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 标签样式 */
.feed-tag {
  background: rgba(48, 207, 121, 0.1);
  color: #30cf79;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(48, 207, 121, 0.15);
  transition: all 0.2s;
  border: 1px solid rgba(48, 207, 121, 0.15);
}

.feed-tag:hover {
  background: rgba(48, 207, 121, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 3px 7px rgba(48, 207, 121, 0.2);
}

/* 导航按钮 */
.feed-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.feed-nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
}

.feed-nav-btn.prev {
  left: -80px;
}

.feed-nav-btn.next {
  right: -80px;
}

/* 关闭按钮 */
.feed-close-btn {
  position: absolute;
  top: -60px;
  right: 0;
  color: white;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.feed-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
}

/* 计数器 */
.feed-counter {
  position: absolute;
  top: -50px;
  left: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.05em;
}

/* 进度条 */
.feed-progress {
  position: absolute;
  bottom: -40px;
  left: 0;
  width: 100%;
  height: 5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2) inset;
}

.feed-progress-bar {
  height: 100%;
  background: linear-gradient(to right, #30cf79, #3adfaa);
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 8px rgba(48, 207, 121, 0.5);
}

/* 点击区域提示 */
.feed-swipe-hint {
  position: absolute;
  bottom: -70px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 300;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 菜单和Toast样式 */
.feed-toast {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.feed-share-menu,
.feed-export-menu {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transform: translateY(5px);
  animation: menuFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes menuFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feed-share-option,
.feed-export-option {
  padding: 12px 18px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  color: #4b5563;
}

.feed-share-option:hover,
.feed-export-option:hover {
  background: rgba(48, 207, 121, 0.1);
  color: #30cf79;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .feed-nav-btn {
    width: 40px;
    height: 40px;
  }
  
  .feed-nav-btn.prev {
    left: -50px;
  }
  
  .feed-nav-btn.next {
    right: -50px;
  }
  
  .feed-card-header,
  .feed-card-content,
  .feed-card-footer {
    padding: 16px 20px;
  }
  
  .feed-card {
    border-radius: 14px;
    max-width: 100%;
  }
  
  .feed-action-btn {
    padding: 6px 10px;
    font-size: 13px;
  }
}

/* 动画类 */
.fade-in {
  opacity: 1 !important;
}

.slide-up {
  transform: translateY(0) rotateX(0deg) !important;
  opacity: 1 !important;
}
`;

// 导出样式
window.feedStylesContent = feedStyles; 