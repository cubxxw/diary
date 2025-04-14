// 沉浸式Feed模式功能
(function() {
  'use strict';

  // 全局变量
  let currentMemoIndex = 0;
  let allMemos = [];
  let isFeedModeActive = false;

  // 导出全局函数
  window.toggleFeedMode = toggleFeedMode;

  // 等待页面加载完成
  document.addEventListener('DOMContentLoaded', function() {
    // 初始化Feed模式
    initFeedMode();
    
    // 监听来自父窗口的消息
    window.addEventListener('message', function(event) {
      if (event.data === 'activateFeedMode') {
        if (!isFeedModeActive) {
          toggleFeedMode();
        }
      }
    });
  });

  // 初始化Feed模式
  function initFeedMode() {
    console.log("初始化Feed模式...");
    
    // 直接获取文档中的笔记卡片
    const memos = document.querySelectorAll('.memo');
    
    if (memos.length > 0) {
      console.log("找到笔记卡片：", memos.length);
      // 创建Feed模式按钮
      createFeedModeButton();
      
      // 监听键盘事件
      document.addEventListener('keydown', handleKeyboardNavigation);
      
      return;
    }
    
    // 如果直接获取失败，尝试通过iframe获取
    const iframe = document.getElementById('content-frame');
    if (iframe && iframe.contentDocument) {
      const iframeMemos = iframe.contentDocument.querySelectorAll('.memo');
      
      if (iframeMemos.length > 0) {
        console.log("在iframe中找到笔记卡片：", iframeMemos.length);
        // 创建Feed模式按钮
        createFeedModeButton();
        
        // 监听键盘事件
        document.addEventListener('keydown', handleKeyboardNavigation);
        
        return;
      }
    }
    
    // 如果仍然找不到，延迟尝试
    console.log("未找到笔记卡片，等待加载...");
    setTimeout(function() {
      const delayedMemos = document.querySelectorAll('.memo');
      if (delayedMemos.length > 0) {
        console.log("延迟加载找到笔记卡片：", delayedMemos.length);
        // 创建Feed模式按钮
        createFeedModeButton();
        
        // 监听键盘事件
        document.addEventListener('keydown', handleKeyboardNavigation);
      } else {
        console.log("无法找到笔记卡片，请检查DOM结构");
      }
    }, 2000);
  }

  // 创建Feed模式按钮
  function createFeedModeButton() {
    // 检查按钮是否已存在
    if (document.getElementById('feed-mode-button')) {
      return;
    }
    
    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'feed-mode-button-container';
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.left = '20px';
    buttonContainer.style.top = '50%';
    buttonContainer.style.transform = 'translateY(-50%)';
    buttonContainer.style.zIndex = '9999';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.gap = '10px';
    
    // 创建Feed模式按钮
    const feedButton = document.createElement('div');
    feedButton.id = 'feed-mode-button';
    feedButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 19V5M5 12h14"></path>
      </svg>
    `;
    feedButton.style.width = '40px';
    feedButton.style.height = '40px';
    feedButton.style.borderRadius = '50%';
    feedButton.style.backgroundColor = '#30cf79';
    feedButton.style.display = 'flex';
    feedButton.style.justifyContent = 'center';
    feedButton.style.alignItems = 'center';
    feedButton.style.cursor = 'pointer';
    feedButton.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    feedButton.style.transition = 'all 0.3s';
    feedButton.style.color = 'white';
    
    // 悬停效果
    feedButton.addEventListener('mouseover', function() {
      this.style.transform = 'scale(1.1)';
    });
    
    feedButton.addEventListener('mouseout', function() {
      this.style.transform = 'scale(1)';
    });
    
    // 添加提示文字
    const tooltip = document.createElement('div');
    tooltip.textContent = 'Feed模式';
    tooltip.style.position = 'absolute';
    tooltip.style.left = '50px';
    tooltip.style.background = '#333';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.3s';
    tooltip.style.pointerEvents = 'none';
    
    feedButton.addEventListener('mouseover', function() {
      tooltip.style.opacity = '1';
    });
    
    feedButton.addEventListener('mouseout', function() {
      tooltip.style.opacity = '0';
    });
    
    // 点击切换Feed模式
    feedButton.addEventListener('click', function() {
      toggleFeedMode();
    });
    
    buttonContainer.appendChild(feedButton);
    buttonContainer.appendChild(tooltip);
    document.body.appendChild(buttonContainer);
  }

  // 切换Feed模式
  function toggleFeedMode() {
    isFeedModeActive = !isFeedModeActive;
    
    if (isFeedModeActive) {
      activateFeedMode();
    } else {
      deactivateFeedMode();
    }
  }

  // 激活Feed模式
  function activateFeedMode() {
    console.log("激活Feed模式...");
    
    // 获取所有笔记
    let memos = document.querySelectorAll('.memo');
    
    // 如果直接获取失败，尝试通过iframe获取
    if (memos.length === 0) {
      const iframe = document.getElementById('content-frame');
      if (iframe && iframe.contentDocument) {
        memos = iframe.contentDocument.querySelectorAll('.memo');
        console.log("在iframe中找到笔记卡片：", memos.length);
      }
    }
    
    if (memos.length === 0) {
      console.error("无法找到笔记卡片，Feed模式启动失败");
      showToast("无法找到笔记卡片，请刷新页面重试");
      return;
    }
    
    allMemos = Array.from(memos);
    currentMemoIndex = 0;
    
    // 创建Feed模式界面
    createFeedModeInterface();
    
    // 显示第一条笔记
    showMemoInFeed(currentMemoIndex);
    
    // 更改Feed按钮样式为激活状态
    const feedButton = document.getElementById('feed-mode-button');
    if (feedButton) {
      feedButton.style.backgroundColor = '#ff6b6b';
      feedButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6L6 18M6 6l12 12"></path>
        </svg>
      `;
    }
    
    console.log("Feed模式激活成功");
  }

  // 停用Feed模式
  function deactivateFeedMode() {
    // 移除Feed模式界面
    const feedInterface = document.getElementById('feed-mode-interface');
    if (feedInterface) {
      document.body.removeChild(feedInterface);
    }
    
    // 恢复Feed按钮样式
    const feedButton = document.getElementById('feed-mode-button');
    if (feedButton) {
      feedButton.style.backgroundColor = '#30cf79';
      feedButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19V5M5 12h14"></path>
        </svg>
      `;
    }
  }

  // 创建Feed模式界面
  function createFeedModeInterface() {
    // 检查界面是否已存在
    if (document.getElementById('feed-mode-interface')) {
      return;
    }
    
    // 创建界面容器
    const interfaceContainer = document.createElement('div');
    interfaceContainer.id = 'feed-mode-interface';
    interfaceContainer.style.position = 'fixed';
    interfaceContainer.style.top = '0';
    interfaceContainer.style.left = '0';
    interfaceContainer.style.width = '100%';
    interfaceContainer.style.height = '100%';
    interfaceContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    interfaceContainer.style.zIndex = '9998';
    interfaceContainer.style.display = 'flex';
    interfaceContainer.style.justifyContent = 'center';
    interfaceContainer.style.alignItems = 'center';
    
    // 创建滑动容器
    const slideContainer = document.createElement('div');
    slideContainer.id = 'feed-slide-container';
    slideContainer.style.width = '90%';
    slideContainer.style.maxWidth = '800px';
    slideContainer.style.height = '80%';
    slideContainer.style.position = 'relative';
    slideContainer.style.overflow = 'hidden';
    
    // 创建卡片容器
    const cardContainer = document.createElement('div');
    cardContainer.id = 'feed-card-container';
    cardContainer.style.width = '100%';
    cardContainer.style.height = '100%';
    cardContainer.style.display = 'flex';
    cardContainer.style.justifyContent = 'center';
    cardContainer.style.alignItems = 'center';
    
    // 添加导航按钮
    const prevButton = document.createElement('div');
    prevButton.className = 'feed-nav-button prev';
    prevButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6"></path>
      </svg>
    `;
    prevButton.style.position = 'absolute';
    prevButton.style.left = '-60px';
    prevButton.style.top = '50%';
    prevButton.style.transform = 'translateY(-50%)';
    prevButton.style.cursor = 'pointer';
    prevButton.style.color = 'white';
    prevButton.style.opacity = '0.7';
    prevButton.style.transition = 'opacity 0.3s';
    
    prevButton.addEventListener('mouseover', function() {
      this.style.opacity = '1';
    });
    
    prevButton.addEventListener('mouseout', function() {
      this.style.opacity = '0.7';
    });
    
    prevButton.addEventListener('click', function() {
      navigateMemo('prev');
    });
    
    const nextButton = document.createElement('div');
    nextButton.className = 'feed-nav-button next';
    nextButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18l6-6-6-6"></path>
      </svg>
    `;
    nextButton.style.position = 'absolute';
    nextButton.style.right = '-60px';
    nextButton.style.top = '50%';
    nextButton.style.transform = 'translateY(-50%)';
    nextButton.style.cursor = 'pointer';
    nextButton.style.color = 'white';
    nextButton.style.opacity = '0.7';
    nextButton.style.transition = 'opacity 0.3s';
    
    nextButton.addEventListener('mouseover', function() {
      this.style.opacity = '1';
    });
    
    nextButton.addEventListener('mouseout', function() {
      this.style.opacity = '0.7';
    });
    
    nextButton.addEventListener('click', function() {
      navigateMemo('next');
    });
    
    // 添加进度指示器
    const progressContainer = document.createElement('div');
    progressContainer.id = 'feed-progress-container';
    progressContainer.style.position = 'absolute';
    progressContainer.style.bottom = '-40px';
    progressContainer.style.left = '0';
    progressContainer.style.width = '100%';
    progressContainer.style.display = 'flex';
    progressContainer.style.justifyContent = 'center';
    progressContainer.style.gap = '10px';
    
    // 创建进度点
    for (let i = 0; i < allMemos.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'feed-progress-dot';
      dot.dataset.index = i;
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.borderRadius = '50%';
      dot.style.backgroundColor = i === 0 ? '#30cf79' : 'rgba(255, 255, 255, 0.3)';
      dot.style.cursor = 'pointer';
      dot.style.transition = 'all 0.3s';
      
      dot.addEventListener('click', function() {
        currentMemoIndex = parseInt(this.dataset.index);
        showMemoInFeed(currentMemoIndex);
      });
      
      progressContainer.appendChild(dot);
    }
    
    // 添加计数器
    const counter = document.createElement('div');
    counter.id = 'feed-counter';
    counter.style.position = 'absolute';
    counter.style.top = '-40px';
    counter.style.right = '0';
    counter.style.color = 'white';
    counter.style.fontSize = '14px';
    counter.textContent = `1 / ${allMemos.length}`;
    
    // 添加关闭按钮
    const closeButton = document.createElement('div');
    closeButton.id = 'feed-close-button';
    closeButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6L6 18M6 6l12 12"></path>
      </svg>
    `;
    closeButton.style.position = 'absolute';
    closeButton.style.top = '-40px';
    closeButton.style.left = '0';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = 'white';
    closeButton.style.opacity = '0.7';
    closeButton.style.transition = 'opacity 0.3s';
    
    closeButton.addEventListener('mouseover', function() {
      this.style.opacity = '1';
    });
    
    closeButton.addEventListener('mouseout', function() {
      this.style.opacity = '0.7';
    });
    
    closeButton.addEventListener('click', function() {
      toggleFeedMode();
    });
    
    // 组装界面
    slideContainer.appendChild(cardContainer);
    slideContainer.appendChild(prevButton);
    slideContainer.appendChild(nextButton);
    slideContainer.appendChild(progressContainer);
    slideContainer.appendChild(counter);
    slideContainer.appendChild(closeButton);
    
    interfaceContainer.appendChild(slideContainer);
    document.body.appendChild(interfaceContainer);
  }

  // 在Feed中显示指定笔记
  function showMemoInFeed(index) {
    if (index < 0 || index >= allMemos.length) return;
    
    const cardContainer = document.getElementById('feed-card-container');
    if (!cardContainer) return;
    
    // 清空容器
    cardContainer.innerHTML = '';
    
    // 获取原始笔记
    const originalMemo = allMemos[index];
    
    // 创建美化版笔记卡片
    const feedCard = document.createElement('div');
    feedCard.className = 'feed-card';
    feedCard.style.width = '100%';
    feedCard.style.maxWidth = '600px';
    feedCard.style.backgroundColor = 'white';
    feedCard.style.borderRadius = '12px';
    feedCard.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2)';
    feedCard.style.overflow = 'hidden';
    feedCard.style.transition = 'all 0.3s';
    feedCard.style.opacity = '0';
    feedCard.style.transform = 'translateY(20px)';
    
    // 卡片头部
    const cardHeader = document.createElement('div');
    cardHeader.style.padding = '20px';
    cardHeader.style.borderBottom = '1px solid #eee';
    cardHeader.style.display = 'flex';
    cardHeader.style.justifyContent = 'space-between';
    cardHeader.style.alignItems = 'center';
    
    const dateElement = document.createElement('div');
    dateElement.className = 'feed-card-date';
    dateElement.textContent = originalMemo.querySelector('.time').textContent;
    dateElement.style.color = '#888';
    dateElement.style.fontSize = '14px';
    
    const actionButtons = document.createElement('div');
    actionButtons.className = 'feed-card-actions';
    actionButtons.style.display = 'flex';
    actionButtons.style.gap = '15px';
    
    // 分享按钮
    const shareButton = document.createElement('div');
    shareButton.className = 'feed-action-button';
    shareButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
        <polyline points="16 6 12 2 8 6"></polyline>
        <line x1="12" y1="2" x2="12" y2="15"></line>
      </svg>
    `;
    shareButton.style.cursor = 'pointer';
    shareButton.style.color = '#666';
    shareButton.style.transition = 'color 0.2s';
    
    shareButton.addEventListener('mouseover', function() {
      this.style.color = '#30cf79';
    });
    
    shareButton.addEventListener('mouseout', function() {
      this.style.color = '#666';
    });
    
    shareButton.addEventListener('click', function() {
      // 调用分享模态框
      showShareModal(originalMemo, index);
      // 临时关闭Feed模式
      deactivateFeedMode();
    });
    
    // 复制按钮
    const copyButton = document.createElement('div');
    copyButton.className = 'feed-action-button';
    copyButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    `;
    copyButton.style.cursor = 'pointer';
    copyButton.style.color = '#666';
    copyButton.style.transition = 'color 0.2s';
    
    copyButton.addEventListener('mouseover', function() {
      this.style.color = '#30cf79';
    });
    
    copyButton.addEventListener('mouseout', function() {
      this.style.color = '#666';
    });
    
    copyButton.addEventListener('click', function() {
      // 复制文本
      const content = originalMemo.querySelector('.content').textContent;
      navigator.clipboard.writeText(content).then(() => {
        // 显示复制成功提示
        showToast('复制成功');
      });
    });
    
    // 收藏按钮
    const favoriteButton = document.createElement('div');
    favoriteButton.className = 'feed-action-button';
    favoriteButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
    `;
    favoriteButton.style.cursor = 'pointer';
    favoriteButton.style.color = '#666';
    favoriteButton.style.transition = 'color 0.2s';
    
    favoriteButton.addEventListener('mouseover', function() {
      this.style.color = '#ffc107';
    });
    
    favoriteButton.addEventListener('mouseout', function() {
      this.style.color = '#666';
    });
    
    favoriteButton.addEventListener('click', function() {
      this.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#ffc107" stroke="#ffc107" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      `;
      this.style.color = '#ffc107';
      
      // 显示收藏成功提示
      showToast('已添加到收藏');
    });
    
    actionButtons.appendChild(shareButton);
    actionButtons.appendChild(copyButton);
    actionButtons.appendChild(favoriteButton);
    
    cardHeader.appendChild(dateElement);
    cardHeader.appendChild(actionButtons);
    
    // 卡片内容
    const cardContent = document.createElement('div');
    cardContent.className = 'feed-card-content';
    cardContent.style.padding = '20px';
    cardContent.style.maxHeight = '60vh';
    cardContent.style.overflow = 'auto';
    
    // 复制内容，保留原格式和样式
    const contentElement = originalMemo.querySelector('.content').cloneNode(true);
    cardContent.appendChild(contentElement);
    
    // 应用额外样式
    contentElement.style.fontSize = '16px';
    contentElement.style.lineHeight = '1.7';
    contentElement.style.color = '#333';
    
    // 代码块样式
    const codeBlocks = contentElement.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
      block.style.backgroundColor = '#f5f7fa';
      block.style.borderRadius = '6px';
      block.style.padding = '12px';
      block.style.fontFamily = 'monospace';
      block.style.fontSize = '14px';
      block.style.overflowX = 'auto';
      block.style.display = 'block';
      block.style.margin = '12px 0';
    });
    
    // 添加标签区域
    const cardFooter = document.createElement('div');
    cardFooter.className = 'feed-card-footer';
    cardFooter.style.padding = '15px 20px';
    cardFooter.style.borderTop = '1px solid #eee';
    
    // 提取标签
    const tags = [];
    const contentText = originalMemo.querySelector('.content').textContent;
    const tagMatches = contentText.match(/#[\w\/]+/g);
    if (tagMatches) {
      tagMatches.forEach(tag => tags.push(tag));
    }
    
    // 显示标签
    if (tags.length > 0) {
      tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'feed-tag';
        tagElement.textContent = tag;
        tagElement.style.backgroundColor = '#f0f0f0';
        tagElement.style.color = '#666';
        tagElement.style.padding = '4px 8px';
        tagElement.style.borderRadius = '4px';
        tagElement.style.marginRight = '8px';
        tagElement.style.fontSize = '12px';
        tagElement.style.display = 'inline-block';
        
        cardFooter.appendChild(tagElement);
      });
    }
    
    // 组装卡片
    feedCard.appendChild(cardHeader);
    feedCard.appendChild(cardContent);
    if (tags.length > 0) {
      feedCard.appendChild(cardFooter);
    }
    
    // 添加到容器
    cardContainer.appendChild(feedCard);
    
    // 淡入动画
    setTimeout(() => {
      feedCard.style.opacity = '1';
      feedCard.style.transform = 'translateY(0)';
    }, 50);
    
    // 更新进度指示器
    updateProgressIndicator(index);
    
    // 更新计数器
    document.getElementById('feed-counter').textContent = `${index + 1} / ${allMemos.length}`;
  }

  // 更新进度指示器
  function updateProgressIndicator(activeIndex) {
    const dots = document.querySelectorAll('.feed-progress-dot');
    
    dots.forEach((dot, index) => {
      dot.style.backgroundColor = index === activeIndex ? '#30cf79' : 'rgba(255, 255, 255, 0.3)';
      dot.style.transform = index === activeIndex ? 'scale(1.5)' : 'scale(1)';
    });
  }

  // 导航到上一条或下一条笔记
  function navigateMemo(direction) {
    if (direction === 'prev') {
      currentMemoIndex = currentMemoIndex > 0 ? currentMemoIndex - 1 : allMemos.length - 1;
    } else {
      currentMemoIndex = currentMemoIndex < allMemos.length - 1 ? currentMemoIndex + 1 : 0;
    }
    
    showMemoInFeed(currentMemoIndex);
  }

  // 处理键盘导航
  function handleKeyboardNavigation(e) {
    if (!isFeedModeActive) return;
    
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        navigateMemo('prev');
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        navigateMemo('next');
        break;
      case 'Escape':
        toggleFeedMode();
        break;
    }
  }

  // 显示提示信息
  function showToast(message) {
    console.log("显示提示：", message);
    
    // 检查是否已有toast
    let toast = document.getElementById('feed-toast');
    
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'feed-toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '30px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      toast.style.color = 'white';
      toast.style.padding = '10px 20px';
      toast.style.borderRadius = '4px';
      toast.style.fontSize = '14px';
      toast.style.zIndex = '10001';
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      
      document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.opacity = '1';
    
    // 3秒后隐藏
    setTimeout(() => {
      toast.style.opacity = '0';
    }, 3000);
  }

})(); 