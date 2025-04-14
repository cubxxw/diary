// Feed模式样式定义
const feedStyles = `
/* Feed模式容器 */
#feed-mode-interface {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(25,25,35,0.95) 100%);
  z-index: 9998;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(8px);
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
  max-width: 700px;
  height: auto;
  max-height: 80vh;
  position: relative;
  perspective: 1000px;
}

/* 卡片样式 */
.feed-card {
  width: 100%;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 卡片头部 */
.feed-card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 日期显示 */
.feed-card-date {
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
}

/* 卡片内容区域 */
.feed-card-content {
  padding: 24px;
  overflow-y: auto;
  max-height: 60vh;
}

/* 卡片内容排版优化 */
.feed-card-content p {
  margin: 0 0 16px 0;
  line-height: 1.7;
  font-size: 16px;
  color: #333;
}

/* 代码块样式 */
.feed-card-content pre {
  background-color: #f6f8fa;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  margin: 16px 0;
}

.feed-card-content code {
  font-family: Consolas, Monaco, 'Andale Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
}

/* 链接样式 */
.feed-card-content a {
  color: #30cf79;
  text-decoration: none;
  border-bottom: 1px solid #30cf79;
  transition: all 0.2s;
}

.feed-card-content a:hover {
  opacity: 0.8;
}

/* 卡片底部 */
.feed-card-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
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
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
  border: none;
  background: transparent;
}

.feed-action-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #30cf79;
}

.feed-action-btn.active {
  color: #30cf79;
}

/* 标签区域 */
.feed-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 标签样式 */
.feed-tag {
  background: #f0f8f4;
  color: #30cf79;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
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
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feed-nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
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
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feed-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

/* 计数器 */
.feed-counter {
  position: absolute;
  top: -50px;
  left: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  display: flex;
  align-items: center;
}

/* 进度条 */
.feed-progress {
  position: absolute;
  bottom: -40px;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.feed-progress-bar {
  height: 100%;
  background: #30cf79;
  transition: width 0.3s;
}

/* 点击区域提示 */
.feed-swipe-hint {
  position: absolute;
  bottom: -70px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 菜单和Toast样式 */
.feed-toast {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.feed-share-menu,
.feed-export-menu {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.feed-share-option,
.feed-export-option {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
}

.feed-share-option:hover,
.feed-export-option:hover {
  background: #f5f5f5;
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
    padding: 16px;
  }
}

/* 动画类 */
.fade-in {
  opacity: 1 !important;
}

.slide-up {
  transform: translateY(0) !important;
  opacity: 1 !important;
}
`;

// 导出样式
window.feedStylesContent = feedStyles; 