// 一键应用移动端修复
(function() {
  'use strict';
  
  // 1. 立即修复视口设置
  function fixViewport() {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    
    // 强制应用body样式
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
    document.body.style.maxWidth = '100vw';
    document.body.style.width = '100%';
  }
  
  // 2. 修复容器宽度
  function fixContainers() {
    // 修复header
    const header = document.querySelector('header');
    if (header) {
      header.style.width = '100%';
      header.style.maxWidth = '100vw';
      header.style.padding = '0 10px';
      header.style.boxSizing = 'border-box';
    }
    
    // 修复top区域
    const headerTop = document.querySelector('header .top');
    if (headerTop && window.innerWidth <= 768) {
      headerTop.style.flexDirection = 'column';
      headerTop.style.alignItems = 'stretch';
      headerTop.style.width = '100%';
    }
    
    // 修复filter区域
    const filter = document.querySelector('header .top .filter');
    if (filter && window.innerWidth <= 768) {
      filter.style.flexDirection = 'column';
      filter.style.width = '100%';
      filter.style.gap = '10px';
      filter.style.marginTop = '15px';
      
      // 修复按钮
      const buttons = filter.querySelectorAll('button');
      buttons.forEach(btn => {
        btn.style.width = '100%';
        btn.style.maxWidth = 'none';
        btn.style.fontSize = '16px';
        btn.style.padding = '12px';
      });
    }
    
    // 修复memos容器
    const memos = document.querySelector('.memos');
    if (memos) {
      memos.style.width = '100%';
      memos.style.maxWidth = '100vw';
      memos.style.padding = '10px';
      memos.style.margin = '0';
      memos.style.boxSizing = 'border-box';
    }
    
    // 修复memo卡片
    const memoCards = document.querySelectorAll('.memo');
    memoCards.forEach(memo => {
      memo.style.width = 'calc(100% - 20px)';
      memo.style.maxWidth = 'calc(100vw - 20px)';
      memo.style.margin = '10px auto';
      memo.style.padding = '15px';
      memo.style.boxSizing = 'border-box';
      memo.style.wordWrap = 'break-word';
      memo.style.overflowWrap = 'break-word';
      
      // 修复内容区域
      const content = memo.querySelector('.content');
      if (content) {
        content.style.width = '100%';
        content.style.maxWidth = '100%';
        content.style.wordWrap = 'break-word';
        content.style.overflowWrap = 'break-word';
        content.style.wordBreak = 'break-word';
      }
    });
  }
  
  // 3. 修复长文本和链接
  function fixTextOverflow() {
    const allElements = document.querySelectorAll('.memo .content p, .memo .content a, .memo .content span');
    allElements.forEach(el => {
      el.style.maxWidth = '100%';
      el.style.wordWrap = 'break-word';
      el.style.overflowWrap = 'break-word';
      
      if (el.tagName === 'A' && el.textContent.length > 30) {
        el.style.wordBreak = 'break-all';
      }
    });
  }
  
  // 4. 修复搜索框
  function fixSearchBar() {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer && window.innerWidth <= 768) {
      searchContainer.style.width = '100%';
      searchContainer.style.maxWidth = '100%';
      searchContainer.style.padding = '10px';
      searchContainer.style.boxSizing = 'border-box';
      
      const searchInput = searchContainer.querySelector('.search-input, input[type="text"]');
      if (searchInput) {
        searchInput.style.width = 'calc(100% - 80px)';
        searchInput.style.maxWidth = 'calc(100% - 80px)';
      }
      
      const searchBtn = searchContainer.querySelector('.search-button, button');
      if (searchBtn) {
        searchBtn.style.width = '70px';
        searchBtn.style.flexShrink = '0';
      }
    }
  }
  
  // 5. 应用所有修复
  function applyAllFixes() {
    fixViewport();
    fixContainers();
    fixTextOverflow();
    fixSearchBar();
    
    // 监听窗口大小变化
    window.addEventListener('resize', function() {
      setTimeout(() => {
        fixContainers();
        fixSearchBar();
      }, 100);
    });
    
    console.log('移动端修复已应用');
  }
  
  // 6. DOM加载完成后应用修复
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAllFixes);
  } else {
    applyAllFixes();
  }
  
  // 7. 为动态内容变化重新应用修复
  const observer = new MutationObserver(function(mutations) {
    let shouldReapply = false;
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        shouldReapply = true;
      }
    });
    
    if (shouldReapply) {
      setTimeout(applyAllFixes, 100);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
})();