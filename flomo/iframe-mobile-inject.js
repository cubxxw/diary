// 为iframe内容注入移动端修复的独立脚本
// 这个脚本会被直接加载到原始的flomo页面中

(function() {
  'use strict';
  
  console.log('iframe移动端修复开始加载...');
  
  // 1. 确保viewport设置
  function ensureViewport() {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    console.log('Viewport设置完成');
  }
  
  // 2. 注入移动端CSS
  function injectMobileCSS() {
    const mobileCSS = document.createElement('style');
    mobileCSS.id = 'iframe-mobile-fix';
    mobileCSS.textContent = `
      /* iframe内移动端修复CSS */
      html, body {
        overflow-x: hidden !important;
        max-width: 100vw !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }
      
      * {
        box-sizing: border-box !important;
      }
      
      @media (max-width: 768px) {
        /* 防止所有元素超出屏幕 */
        * {
          max-width: 100% !important;
        }
        
        /* Header完全重构 */
        header {
          width: 100% !important;
          max-width: 100vw !important;
          padding: 0 5px !important;
          margin: 0 !important;
        }
        
        header .logo {
          padding: 8px 0 !important;
          text-align: center !important;
        }
        
        header .logo svg {
          max-width: 120px !important;
          height: auto !important;
        }
        
        header .top {
          flex-direction: column !important;
          align-items: stretch !important;
          padding: 5px !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        
        header .top .user {
          text-align: center !important;
          width: 100% !important;
          padding: 8px 0 !important;
          margin: 0 !important;
        }
        
        header .top .user .name {
          font-size: 14px !important;
        }
        
        header .top .user .date {
          font-size: 12px !important;
          margin-top: 2px !important;
        }
        
        header .top .filter {
          flex-direction: column !important;
          width: 100% !important;
          gap: 8px !important;
          margin-top: 10px !important;
          padding: 0 !important;
        }
        
        header .top .filter > * {
          width: 100% !important;
          margin: 0 0 8px 0 !important;
        }
        
        header .top .filter button {
          width: 100% !important;
          max-width: none !important;
          padding: 10px !important;
          font-size: 14px !important;
          margin: 0 !important;
          border-radius: 4px !important;
        }
        
        /* 自定义选择框 */
        .custom-select {
          width: 100% !important;
          margin: 0 0 8px 0 !important;
        }
        
        .select-selected {
          width: 100% !important;
          padding: 10px !important;
          font-size: 14px !important;
        }
        
        /* 内容区域完全重构 */
        .memos {
          width: 100% !important;
          max-width: 100vw !important;
          padding: 5px !important;
          margin: 0 !important;
        }
        
        .memo {
          width: calc(100% - 10px) !important;
          max-width: calc(100vw - 10px) !important;
          margin: 8px auto !important;
          padding: 12px !important;
          border-radius: 8px !important;
          
          /* 强制文本换行 */
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          word-break: break-word !important;
          hyphens: auto !important;
          -webkit-hyphens: auto !important;
          -moz-hyphens: auto !important;
        }
        
        .memo .time {
          font-size: 12px !important;
          margin-bottom: 8px !important;
        }
        
        .memo .content {
          width: 100% !important;
          max-width: 100% !important;
          
          /* 强制所有内容换行 */
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          word-break: break-word !important;
          hyphens: auto !important;
          -webkit-hyphens: auto !important;
          -moz-hyphens: auto !important;
        }
        
        .memo .content * {
          max-width: 100% !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
        
        .memo .content p {
          margin-bottom: 10px !important;
          line-height: 1.5 !important;
          font-size: 14px !important;
        }
        
        /* 长URL和链接处理 */
        .memo .content a {
          word-break: break-all !important;
          overflow-wrap: break-word !important;
          display: inline-block !important;
          max-width: 100% !important;
          font-size: 13px !important;
          line-height: 1.4 !important;
        }
        
        /* 处理长文本和标签 */
        .memo .content span,
        .tag-highlight {
          display: inline !important;
          max-width: 100% !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
        
        /* 图片完全响应式 */
        img, .memo img, .memo .files img {
          max-width: 100% !important;
          width: auto !important;
          height: auto !important;
          display: block !important;
          margin: 8px auto !important;
        }
        
        /* 搜索框重构 */
        .search-container {
          width: 100% !important;
          max-width: 100% !important;
          padding: 8px 5px !important;
          margin: 0 !important;
          flex-direction: column !important;
          gap: 8px !important;
        }
        
        .search-input, #memo-search {
          width: 100% !important;
          max-width: 100% !important;
          font-size: 16px !important; /* 防止iOS缩放 */
          padding: 10px !important;
          border-radius: 4px !important;
          margin: 0 !important;
        }
        
        .search-button {
          width: 100% !important;
          max-width: 100% !important;
          padding: 10px !important;
          font-size: 14px !important;
          margin: 0 !important;
        }
        
        /* 标签云重构 */
        .tag-cloud {
          width: calc(100% - 10px) !important;
          max-width: calc(100vw - 10px) !important;
          margin: 8px auto !important;
          padding: 12px !important;
        }
        
        .tag-cloud h3 {
          font-size: 14px !important;
          margin-bottom: 8px !important;
        }
        
        .tag-cloud span, .tag-cloud-item {
          font-size: 11px !important;
          padding: 3px 6px !important;
          margin: 2px !important;
          display: inline-block !important;
        }
        
        /* 状态消息 */
        .search-status, .filter-status,
        #search-status, #filter-status {
          width: calc(100% - 10px) !important;
          max-width: calc(100vw - 10px) !important;
          margin: 8px auto !important;
          padding: 10px !important;
          text-align: center !important;
          flex-direction: column !important;
          font-size: 13px !important;
        }
        
        .reset-button, .clear-filter {
          width: 100% !important;
          max-width: 200px !important;
          margin: 8px auto 0 auto !important;
          padding: 8px !important;
        }
        
        /* 浮动按钮调整 */
        .back-to-top, #back-to-top {
          right: 8px !important;
          bottom: 50px !important;
          width: 40px !important;
          height: 40px !important;
          font-size: 18px !important;
        }
        
        .dark-mode-toggle, #dark-mode-toggle {
          right: 8px !important;
          bottom: 8px !important;
          width: 40px !important;
          height: 40px !important;
          font-size: 16px !important;
        }
        
        /* 代码和预格式化文本 */
        pre, code {
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
          overflow-x: auto !important;
          max-width: 100% !important;
          font-size: 12px !important;
        }
        
        /* 表格处理 */
        table {
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          display: block !important;
          font-size: 12px !important;
        }
        
        /* 强制所有文本内容不超出 */
        p, div, span, a, strong, em, b, i {
          max-width: 100% !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
      }
      
      /* 超小屏幕进一步优化 */
      @media (max-width: 480px) {
        header .top .filter button {
          font-size: 13px !important;
          padding: 8px !important;
        }
        
        .memo {
          padding: 10px !important;
          font-size: 13px !important;
        }
        
        .memo .content {
          font-size: 13px !important;
          line-height: 1.4 !important;
        }
        
        .memo .content p {
          font-size: 13px !important;
        }
      }
    `;
    
    document.head.appendChild(mobileCSS);
    console.log('移动端CSS注入完成');
  }
  
  // 3. 应用JavaScript修复
  function applyJSFixes() {
    console.log('开始应用JavaScript修复...');
    
    // 强制body样式
    function forceBodyStyles() {
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowX = 'hidden';
      document.body.style.maxWidth = '100vw';
      document.body.style.width = '100%';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
    }
    
    // 修复长URL
    function fixLongURLs() {
      const links = document.querySelectorAll('.memo .content a, a');
      links.forEach(link => {
        if (link.textContent && link.textContent.length > 25) {
          link.style.wordBreak = 'break-all';
          link.style.overflowWrap = 'break-word';
          link.style.display = 'inline-block';
          link.style.maxWidth = '100%';
          console.log('修复长URL:', link.textContent.substring(0, 30) + '...');
        }
      });
    }
    
    // 修复容器宽度
    function fixContainerWidths() {
      const containers = document.querySelectorAll('header, .memos, .memo, .search-container, .tag-cloud');
      containers.forEach(container => {
        container.style.maxWidth = '100%';
        container.style.width = '100%';
      });
      
      console.log('容器宽度修复完成');
    }
    
    // 处理动态内容
    function handleDynamicContent() {
      const observer = new MutationObserver(function(mutations) {
        let hasNewContent = false;
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            hasNewContent = true;
          }
        });
        
        if (hasNewContent) {
          setTimeout(() => {
            forceBodyStyles();
            fixLongURLs();
            fixContainerWidths();
          }, 100);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      console.log('动态内容监听已设置');
    }
    
    // 窗口大小变化处理
    function handleResize() {
      let resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          forceBodyStyles();
          fixLongURLs();
          fixContainerWidths();
          console.log('窗口大小变化，重新应用修复');
        }, 100);
      });
    }
    
    // 应用所有修复
    forceBodyStyles();
    fixLongURLs();
    fixContainerWidths();
    handleDynamicContent();
    handleResize();
    
    console.log('所有JavaScript修复应用完成');
  }
  
  // 4. 主初始化函数
  function initialize() {
    console.log('开始初始化iframe移动端修复...');
    
    ensureViewport();
    injectMobileCSS();
    applyJSFixes();
    
    // 标记修复完成
    document.body.setAttribute('data-mobile-fixed', 'true');
    
    console.log('✅ iframe移动端修复初始化完成');
    
    // 通知父窗口修复完成
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'IFRAME_MOBILE_FIX_COMPLETE',
        success: true
      }, '*');
    }
  }
  
  // DOM准备就绪时执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();