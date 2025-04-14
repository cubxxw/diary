// Feed模式功能函数
const feedFunctions = {
  // 初始化Feed模式
  init: function(memos) {
    // 注入样式
    this.injectStyles();
    
    // 保存所有笔记
    this.allMemos = Array.from(memos);
    this.currentIndex = 0;
    this.active = false;
    
    // 创建界面
    this.createInterface();
    
    // 事件监听
    this.setupEventListeners();
    
    console.log('Feed模式初始化完成，共加载', this.allMemos.length, '条笔记');
  },
  
  // 注入样式
  injectStyles: function() {
    if (!document.getElementById('feed-mode-styles')) {
      const style = document.createElement('style');
      style.id = 'feed-mode-styles';
      style.textContent = window.feedStylesContent || '';
      document.head.appendChild(style);
    }
  },
  
  // 创建界面
  createInterface: function() {
    // 如果已存在则移除
    const existingInterface = document.getElementById('feed-mode-interface');
    if (existingInterface) {
      document.body.removeChild(existingInterface);
    }
    
    // 创建新界面
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = window.feedTemplates.interface;
    const interfaceElement = tempDiv.firstElementChild;
    document.body.appendChild(interfaceElement);
    
    // 默认隐藏
    interfaceElement.style.display = 'none';
    
    // 添加引用
    this.interface = interfaceElement;
    
    // 更新总数
    document.getElementById('feed-total-count').textContent = this.allMemos.length;
    
    // 绑定导航按钮
    const prevBtn = interfaceElement.querySelector('.feed-nav-btn.prev');
    const nextBtn = interfaceElement.querySelector('.feed-nav-btn.next');
    const closeBtn = interfaceElement.querySelector('.feed-close-btn');
    
    prevBtn.addEventListener('click', () => this.navigate('prev'));
    nextBtn.addEventListener('click', () => this.navigate('next'));
    closeBtn.addEventListener('click', () => this.close());
  },
  
  // 设置事件监听
  setupEventListeners: function() {
    // 键盘导航
    document.addEventListener('keydown', e => {
      if (!this.active) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          this.navigate('prev');
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          this.navigate('next');
          break;
        case 'Escape':
          this.close();
          break;
      }
    });
    
    // 阻止背景滚动
    this.interface.addEventListener('wheel', e => {
      if (this.active) {
        // 只在卡片内容区域允许滚动
        const content = e.target.closest('.feed-card-content');
        if (!content) {
          e.preventDefault();
        }
      }
    });
    
    // 点击背景关闭
    this.interface.addEventListener('click', e => {
      if (e.target === this.interface) {
        this.close();
      }
    });
  },
  
  // 打开Feed模式
  open: function() {
    this.active = true;
    this.interface.style.display = 'flex';
    
    // 淡入动画
    setTimeout(() => {
      this.interface.classList.add('fade-in');
    }, 10);
    
    // 显示第一条笔记
    this.showMemo(this.currentIndex);
    
    // 禁用背景滚动，但不使用aria-hidden
    document.body.style.overflow = 'hidden';
    // 为了无障碍性，使用Class来标记状态而不是aria-hidden
    document.body.classList.add('feed-mode-active');
    
    console.log('Feed模式已激活');
  },
  
  // 关闭Feed模式
  close: function() {
    this.active = false;
    
    // 淡出动画
    this.interface.classList.remove('fade-in');
    
    setTimeout(() => {
      this.interface.style.display = 'none';
    }, 300);
    
    // 恢复背景滚动和无障碍状态
    document.body.style.overflow = '';
    document.body.classList.remove('feed-mode-active');
    
    console.log('Feed模式已关闭');
  },
  
  // 导航前后笔记
  navigate: function(direction) {
    if (direction === 'prev') {
      this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.allMemos.length - 1;
    } else {
      this.currentIndex = this.currentIndex < this.allMemos.length - 1 ? this.currentIndex + 1 : 0;
    }
    
    this.showMemo(this.currentIndex);
  },
  
  // 显示指定笔记
  showMemo: function(index) {
    // 获取容器
    const container = document.getElementById('feed-card-container');
    
    // 清空容器
    container.innerHTML = '';
    
    // 获取原始笔记
    const memo = this.allMemos[index];
    
    // 更新计数器
    document.getElementById('feed-current-index').textContent = index + 1;
    
    // 更新进度条
    const progressBar = document.querySelector('.feed-progress-bar');
    progressBar.style.width = `${((index + 1) / this.allMemos.length) * 100}%`;
    
    // 提取笔记信息
    const date = memo.querySelector('.time').textContent;
    const content = memo.querySelector('.content').innerHTML;
    
    // 提取标签
    const tags = [];
    const contentText = memo.querySelector('.content').textContent;
    const tagMatches = contentText.match(/#[\w\/]+/g);
    if (tagMatches) {
      tagMatches.forEach(tag => tags.push(tag));
    }
    
    // 生成标签HTML
    let tagsHtml = '';
    if (tags.length > 0) {
      tags.forEach(tag => {
        tagsHtml += window.feedTemplates.tag.replace('{{tag}}', tag);
      });
    } else {
      tagsHtml = '<div class="feed-tag">无标签</div>';
    }
    
    // 创建卡片
    const cardHtml = window.feedTemplates.card
      .replace('{{date}}', date)
      .replace('{{content}}', content)
      .replace('{{tags}}', tagsHtml);
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cardHtml;
    const cardElement = tempDiv.firstElementChild;
    
    // 添加卡片到容器
    container.appendChild(cardElement);
    
    // 添加卡片动画
    setTimeout(() => {
      cardElement.classList.add('slide-up');
    }, 10);
    
    // 绑定卡片按钮事件
    this.bindCardActions(cardElement, memo);
  },
  
  // 绑定卡片功能按钮
  bindCardActions: function(card, originalMemo) {
    // 复制按钮
    card.querySelector('.feed-action-copy').addEventListener('click', () => {
      const content = originalMemo.querySelector('.content').textContent;
      navigator.clipboard.writeText(content).then(() => {
        this.showToast('内容已复制到剪贴板');
      });
    });
    
    // 分享按钮
    card.querySelector('.feed-action-share').addEventListener('click', (e) => {
      // 检查是否有独立的分享模态框函数
      if (typeof showShareModal === 'function') {
        // 暂时关闭Feed模式
        this.close();
        // 调用分享模态框
        showShareModal(originalMemo, this.currentIndex);
      } else {
        // 显示内置分享选项
        this.showShare(e.currentTarget, originalMemo);
      }
    });
    
    // 收藏按钮
    card.querySelector('.feed-action-fav').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      btn.classList.toggle('active');
      
      if (btn.classList.contains('active')) {
        btn.innerHTML = `
          <svg class="feed-icon" width="16" height="16" viewBox="0 0 24 24" style="fill: #ffb800; stroke: #ffb800;">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          已收藏
        `;
        this.showToast('笔记已加入收藏');
      } else {
        btn.innerHTML = `
          <svg class="feed-icon" width="16" height="16" viewBox="0 0 24 24">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          收藏
        `;
        this.showToast('已取消收藏');
      }
    });
    
    // 导出按钮
    card.querySelector('.feed-action-export').addEventListener('click', (e) => {
      this.exportNote(e.currentTarget, originalMemo);
    });
  },
  
  // 显示分享选项
  showShare: function(button, memo) {
    // 创建分享菜单
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = window.feedTemplates.shareMenu;
    const menu = tempDiv.firstElementChild;
    
    // 设置菜单位置
    menu.style.position = 'absolute';
    menu.style.zIndex = '10000';
    menu.style.backgroundColor = 'white';
    menu.style.borderRadius = '8px';
    menu.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    menu.style.padding = '8px 0';
    menu.style.width = '160px';
    
    // 添加菜单样式
    const menuOptions = menu.querySelectorAll('.feed-share-option');
    menuOptions.forEach(option => {
      option.style.padding = '8px 16px';
      option.style.display = 'flex';
      option.style.alignItems = 'center';
      option.style.cursor = 'pointer';
      option.style.transition = 'background 0.2s';
      
      option.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#f5f5f5';
      });
      
      option.addEventListener('mouseout', function() {
        this.style.backgroundColor = 'transparent';
      });
      
      // 绑定点击事件
      option.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.type;
        
        switch(type) {
          case 'image':
            this.shareAsImage(memo);
            break;
          case 'link':
            this.shareAsLink(memo);
            break;
          case 'wechat':
            this.shareToWeChat(memo);
            break;
        }
        
        // 关闭菜单
        document.body.removeChild(menu);
      });
    });
    
    // 添加到页面
    document.body.appendChild(menu);
    
    // 计算位置
    const buttonRect = button.getBoundingClientRect();
    menu.style.top = buttonRect.bottom + 'px';
    menu.style.left = buttonRect.left + 'px';
    
    // 点击外部关闭菜单
    const closeMenu = function(e) {
      if (!menu.contains(e.target) && e.target !== button) {
        document.body.removeChild(menu);
        document.removeEventListener('click', closeMenu);
      }
    };
    
    // 延迟添加事件，防止立即触发
    setTimeout(() => {
      document.addEventListener('click', closeMenu);
    }, 0);
  },
  
  // 导出笔记
  exportNote: function(button, memo) {
    // 创建导出菜单
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = window.feedTemplates.exportMenu;
    const menu = tempDiv.firstElementChild;
    
    // 设置菜单位置和样式
    menu.style.position = 'absolute';
    menu.style.zIndex = '10000';
    menu.style.backgroundColor = 'white';
    menu.style.borderRadius = '8px';
    menu.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    menu.style.padding = '8px 0';
    menu.style.width = '160px';
    
    // 添加菜单样式
    const menuOptions = menu.querySelectorAll('.feed-export-option');
    menuOptions.forEach(option => {
      option.style.padding = '8px 16px';
      option.style.display = 'flex';
      option.style.alignItems = 'center';
      option.style.cursor = 'pointer';
      option.style.transition = 'background 0.2s';
      
      option.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#f5f5f5';
      });
      
      option.addEventListener('mouseout', function() {
        this.style.backgroundColor = 'transparent';
      });
      
      // 绑定点击事件
      option.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.type;
        const content = memo.querySelector('.content').textContent;
        const date = memo.querySelector('.time').textContent;
        
        switch(type) {
          case 'markdown':
            this.exportAsMarkdown(content, date);
            break;
          case 'pdf':
            this.exportAsPDF(memo);
            break;
          case 'text':
            this.exportAsText(content, date);
            break;
        }
        
        // 关闭菜单
        document.body.removeChild(menu);
      });
    });
    
    // 添加到页面
    document.body.appendChild(menu);
    
    // 计算位置
    const buttonRect = button.getBoundingClientRect();
    menu.style.top = buttonRect.bottom + 'px';
    menu.style.left = (buttonRect.left - 80) + 'px';
    
    // 点击外部关闭菜单
    const closeMenu = function(e) {
      if (!menu.contains(e.target) && e.target !== button) {
        document.body.removeChild(menu);
        document.removeEventListener('click', closeMenu);
      }
    };
    
    // 延迟添加事件，防止立即触发
    setTimeout(() => {
      document.addEventListener('click', closeMenu);
    }, 0);
  },
  
  // 以图片形式分享
  shareAsImage: function(memo) {
    if (typeof html2canvas !== 'undefined') {
      // 创建临时卡片
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'fixed';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      
      const card = document.createElement('div');
      card.style.width = '600px';
      card.style.background = 'white';
      card.style.padding = '20px';
      card.style.borderRadius = '10px';
      card.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
      
      // 卡片头部
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.marginBottom = '15px';
      
      const logo = document.createElement('div');
      logo.innerHTML = 'flomo 浮墨笔记';
      logo.style.fontWeight = 'bold';
      logo.style.color = '#333';
      
      const date = document.createElement('div');
      date.textContent = memo.querySelector('.time').textContent;
      date.style.color = '#888';
      date.style.fontSize = '14px';
      
      header.appendChild(logo);
      header.appendChild(date);
      
      // 卡片内容
      const content = document.createElement('div');
      content.innerHTML = memo.querySelector('.content').innerHTML;
      content.style.lineHeight = '1.6';
      content.style.fontSize = '16px';
      content.style.color = '#333';
      content.style.margin = '15px 0';
      
      // 卡片底部
      const footer = document.createElement('div');
      footer.style.display = 'flex';
      footer.style.justifyContent = 'space-between';
      footer.style.marginTop = '15px';
      footer.style.borderTop = '1px solid #eee';
      footer.style.paddingTop = '15px';
      footer.style.fontSize = '14px';
      footer.style.color = '#888';
      
      // 网址和二维码占位
      const url = document.createElement('div');
      url.textContent = 'nsddd.top';
      
      const qrPlaceholder = document.createElement('div');
      qrPlaceholder.textContent = 'Xinwei Xiong Blog';
      
      footer.appendChild(url);
      footer.appendChild(qrPlaceholder);
      
      // 组装卡片
      card.appendChild(header);
      card.appendChild(content);
      card.appendChild(footer);
      
      tempDiv.appendChild(card);
      document.body.appendChild(tempDiv);
      
      // 截图并下载
      html2canvas(card).then(canvas => {
        const link = document.createElement('a');
        link.download = 'flomo-' + new Date().getTime() + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // 移除临时元素
        document.body.removeChild(tempDiv);
      });
      
      this.showToast('正在生成分享图片...');
    } else {
      this.showToast('生成图片功能需要加载html2canvas库');
      this.loadHtml2Canvas(() => {
        this.shareAsImage(memo);
      });
    }
  },
  
  // 以链接形式分享
  shareAsLink: function(memo) {
    const content = memo.querySelector('.content').textContent;
    const date = memo.querySelector('.time').textContent;
    
    // 创建分享文本
    const shareText = `${date}\n\n${content}\n\n—— 来自 flomo浮墨`;
    
    // 复制到剪贴板
    navigator.clipboard.writeText(shareText).then(() => {
      this.showToast('链接已复制到剪贴板');
    });
  },
  
  // 分享到微信
  shareToWeChat: function(memo) {
    this.showToast('请在手机上使用此功能');
  },
  
  // 导出为Markdown
  exportAsMarkdown: function(content, date) {
    // 转换为Markdown格式
    const mdContent = `# flomo笔记 ${date}\n\n${content}`;
    
    // 创建下载链接
    const blob = new Blob([mdContent], {type: 'text/markdown'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flomo-note-${date.replace(/[/:]/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.showToast('已导出为Markdown文件');
  },
  
  // 导出为PDF
  exportAsPDF: function(memo) {
    this.showToast('PDF导出功能即将上线');
  },
  
  // 导出为纯文本
  exportAsText: function(content, date) {
    // 创建下载链接
    const blob = new Blob([`${date}\n\n${content}`], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flomo-note-${date.replace(/[/:]/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.showToast('已导出为纯文本文件');
  },
  
  // 显示提示消息
  showToast: function(message) {
    // 移除旧的提示
    const oldToast = document.querySelector('.feed-toast');
    if (oldToast) {
      document.body.removeChild(oldToast);
    }
    
    // 创建新提示
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = window.feedTemplates.toast.replace('{{message}}', message);
    const toast = tempDiv.firstElementChild;
    
    // 设置样式
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    toast.style.color = 'white';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';
    toast.style.zIndex = '10001';
    toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 淡入动画
    setTimeout(() => {
      toast.style.opacity = '1';
    }, 10);
    
    // 定时移除
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.contains(toast) && document.body.removeChild(toast);
      }, 300);
    }, 3000);
  },
  
  // 加载html2canvas库
  loadHtml2Canvas: function(callback) {
    if (typeof html2canvas === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
      script.onload = callback;
      document.head.appendChild(script);
    } else {
      callback();
    }
  }
};

// 导出函数
window.feedFunctions = feedFunctions; 