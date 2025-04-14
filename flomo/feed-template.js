// Feed模式HTML模板
const feedTemplate = {
  // 主界面模板
  interface: `
    <div id="feed-mode-interface">
      <div id="feed-card-container">
        <!-- 动态添加卡片 -->
      </div>
      
      <!-- 导航按钮 -->
      <div class="feed-nav-btn prev">
        <svg class="feed-icon" width="24" height="24" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6"></path>
        </svg>
      </div>
      
      <div class="feed-nav-btn next">
        <svg class="feed-icon" width="24" height="24" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6"></path>
        </svg>
      </div>
      
      <!-- 关闭按钮 -->
      <div class="feed-close-btn">
        <svg class="feed-icon" width="24" height="24" viewBox="0 0 24 24">
          <path d="M18 6L6 18M6 6l12 12"></path>
        </svg>
      </div>
      
      <!-- 计数器 -->
      <div class="feed-counter">
        <span id="feed-current-index">1</span> / <span id="feed-total-count">10</span>
      </div>
      
      <!-- 进度条 -->
      <div class="feed-progress">
        <div class="feed-progress-bar" style="width: 10%;"></div>
      </div>
      
      <!-- 提示 -->
      <div class="feed-swipe-hint">
        <svg class="feed-icon" width="16" height="16" viewBox="0 0 24 24">
          <path d="M8 7l4-4 4 4"></path>
          <path d="M12 3v14"></path>
        </svg>
        <span>使用键盘 ↑/↓ 或 ←/→ 键浏览笔记</span>
      </div>
    </div>
  `,
  
  // 卡片模板
  card: `
    <div class="feed-card">
      <div class="feed-card-header">
        <div class="feed-card-date">
          <svg class="feed-icon" width="16" height="16" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span class="date-text">{{date}}</span>
        </div>
      </div>
      
      <div class="feed-card-content">
        {{content}}
      </div>
      
      <div class="feed-card-footer">
        <div class="feed-tags">
          {{tags}}
        </div>
        
        <div class="feed-actions">
          <button class="feed-action-btn feed-action-copy">
            <svg class="feed-icon" width="16" height="16" viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            复制
          </button>
          
          <button class="feed-action-btn feed-action-share">
            <svg class="feed-icon" width="16" height="16" viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            分享
          </button>
          
          <button class="feed-action-btn feed-action-fav">
            <svg class="feed-icon" width="16" height="16" viewBox="0 0 24 24">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            收藏
          </button>
          
          <button class="feed-action-btn feed-action-export">
            <svg class="feed-icon" width="16" height="16" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            导出
          </button>
        </div>
      </div>
    </div>
  `,
  
  // 标签模板
  tag: `<div class="feed-tag">{{tag}}</div>`,
  
  // 分享菜单模板
  shareMenu: `
    <div class="feed-share-menu">
      <div class="feed-share-option" data-type="image">
        <svg class="feed-icon" width="16" height="16" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        生成图片
      </div>
      <div class="feed-share-option" data-type="link">
        <svg class="feed-icon" width="16" height="16" viewBox="0 0 24 24">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        复制链接
      </div>
      <div class="feed-share-option" data-type="wechat">
        <svg class="feed-icon" width="16" height="16" viewBox="0 0 24 24">
          <path d="M9 8a4 4 0 1 1 8 0c0 1.5-.5 2.5-1.5 3.5L12 15l-3.5-3.5C7.5 10.5 7 9.5 7 8a5 5 0 0 1 5-5"></path>
          <path d="M3 15c0-2 .5-3 1.5-4C5.5 9 7 8 10 8h4c3 0 4.5 1.5 5.5 3s1.5 4 1.5 6H3c0-2 0-6 0-8"></path>
          <path d="M12 16v4"></path>
          <path d="M8 20h8"></path>
        </svg>
        分享到微信
      </div>
    </div>
  `,
  
  // 导出菜单模板
  exportMenu: `
    <div class="feed-export-menu">
      <div class="feed-export-option" data-type="markdown">
        <svg class="feed-icon" width="16" height="16" viewBox="0 0 24 24">
          <path d="M3 15a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-6v6l-6-6z"></path>
          <path d="M3 15a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-6v6l-6-6z"></path>
        </svg>
        Markdown
      </div>
      <div class="feed-export-option" data-type="pdf">
        <svg class="feed-icon" width="16" height="16" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        PDF
      </div>
      <div class="feed-export-option" data-type="text">
        <svg class="feed-icon" width="16" height="16" viewBox="0 0 24 24">
          <line x1="21" y1="10" x2="3" y2="10"></line>
          <line x1="21" y1="6" x2="3" y2="6"></line>
          <line x1="21" y1="14" x2="3" y2="14"></line>
          <line x1="21" y1="18" x2="3" y2="18"></line>
        </svg>
        纯文本
      </div>
    </div>
  `,
  
  // 提示模板
  toast: `
    <div class="feed-toast">
      <svg class="feed-icon" width="16" height="16" viewBox="0 0 24 24">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>{{message}}</span>
    </div>
  `
};

// 导出模板
window.feedTemplates = feedTemplate; 