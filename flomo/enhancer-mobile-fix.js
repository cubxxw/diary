// flomo增强版移动端修复脚本
(function() {
  'use strict';

  // 1. 确保外层页面的viewport设置
  function ensureViewport() {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  }

  // 2. 修复外层容器布局
  function fixOuterLayout() {
    const header = document.getElementById('enhancer-header');
    const container = document.getElementById('main-container');
    const sidebar = document.getElementById('sidebar');
    const iframeContainer = document.getElementById('iframe-container');

    if (window.innerWidth <= 768) {
      // Header适配
      if (header) {
        header.style.flexWrap = 'wrap';
        header.style.padding = '8px 10px';
        
        const title = header.querySelector('h1');
        if (title) {
          title.style.fontSize = '16px';
          title.style.marginBottom = '5px';
          title.style.width = '100%';
        }
        
        const buttons = header.querySelector('.enhancer-buttons');
        if (buttons) {
          buttons.style.width = '100%';
          buttons.style.justifyContent = 'space-between';
          buttons.style.marginTop = '8px';
          
          const buttonElements = buttons.querySelectorAll('button');
          buttonElements.forEach(btn => {
            btn.style.flex = '1';
            btn.style.margin = '0 2px';
            btn.style.fontSize = '12px';
            btn.style.padding = '6px 8px';
          });
        }
      }

      // 主容器适配
      if (container) {
        container.style.flexDirection = 'column';
        container.style.height = 'calc(100vh - 80px)';
      }

      // 侧边栏适配
      if (sidebar) {
        sidebar.style.width = '100%';
        sidebar.style.height = 'auto';
        sidebar.style.maxHeight = '40vh';
        sidebar.style.order = '2';
        sidebar.style.borderRight = 'none';
        sidebar.style.borderTop = '1px solid #e0e0e0';
      }

      // iframe容器适配
      if (iframeContainer) {
        iframeContainer.style.order = '1';
        iframeContainer.style.flex = '1';
        iframeContainer.style.display = 'flex';
        iframeContainer.style.flexDirection = 'column';
        iframeContainer.style.minHeight = '0';
        iframeContainer.style.overflow = 'hidden';
        
        // iframe高度适配
        const iframe = iframeContainer.querySelector('iframe');
        if (iframe) {
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.flex = '1';
          iframe.style.minHeight = '0';
          iframe.style.border = 'none';
        }
      }
    }
  }

  // 3. 修复iframe内部内容
  function fixIframeContent() {
    const iframe = document.querySelector('iframe');
    if (!iframe) return;

    // 等待iframe加载完成
    iframe.addEventListener('load', function() {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        // 检查是否可以访问iframe内容（同域检查）
        if (!iframeDoc) return;

        // 1. 注入viewport meta标签到iframe
        let iframeViewport = iframeDoc.querySelector('meta[name="viewport"]');
        if (!iframeViewport) {
          iframeViewport = iframeDoc.createElement('meta');
          iframeViewport.name = 'viewport';
          iframeViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
          iframeDoc.head.appendChild(iframeViewport);
        }

        // 2. 注入移动端修复CSS到iframe
        const iframeMobileFix = iframeDoc.createElement('style');
        iframeMobileFix.textContent = `
          /* iframe内部移动端修复 */
          html, body {
            overflow-x: hidden !important;
            max-width: 100vw !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          @media (max-width: 768px) {
            * {
              max-width: 100% !important;
              box-sizing: border-box !important;
            }
            
            /* Header修复 */
            header {
              width: 100% !important;
              max-width: 100vw !important;
              padding: 0 10px !important;
            }
            
            header .logo {
              padding: 10px 0 !important;
              text-align: center !important;
            }
            
            header .top {
              flex-direction: column !important;
              align-items: stretch !important;
              padding: 10px !important;
              width: 100% !important;
            }
            
            header .top .user {
              text-align: center !important;
              width: 100% !important;
              padding: 10px 0 !important;
            }
            
            header .top .filter {
              flex-direction: column !important;
              width: 100% !important;
              gap: 10px !important;
              margin-top: 15px !important;
            }
            
            header .top .filter button {
              width: 100% !important;
              padding: 12px !important;
              font-size: 16px !important;
              margin-bottom: 5px !important;
            }
            
            .custom-select {
              width: 100% !important;
              margin-right: 0 !important;
              margin-bottom: 10px !important;
            }
            
            /* 内容区域修复 */
            .memos {
              width: 100% !important;
              max-width: 100vw !important;
              padding: 10px !important;
              margin: 0 !important;
            }
            
            .memo {
              width: calc(100% - 20px) !important;
              max-width: calc(100vw - 20px) !important;
              margin: 10px auto !important;
              padding: 15px !important;
              word-wrap: break-word !important;
              overflow-wrap: break-word !important;
            }
            
            .memo .content {
              width: 100% !important;
              max-width: 100% !important;
              word-wrap: break-word !important;
              overflow-wrap: break-word !important;
              word-break: break-word !important;
            }
            
            .memo .content p,
            .memo .content a,
            .memo .content span {
              max-width: 100% !important;
              word-wrap: break-word !important;
              overflow-wrap: break-word !important;
            }
            
            /* 长URL和文本处理 */
            .memo .content a {
              word-break: break-all !important;
              display: inline-block !important;
            }
            
            /* 图片处理 */
            img {
              max-width: 100% !important;
              height: auto !important;
            }
            
            /* 搜索框处理 */
            .search-container {
              width: 100% !important;
              padding: 10px !important;
              flex-direction: column !important;
              gap: 10px !important;
            }
            
            .search-input {
              width: 100% !important;
              font-size: 16px !important;
            }
            
            .search-button {
              width: 100% !important;
            }
            
            /* 标签云处理 */
            .tag-cloud {
              width: calc(100% - 20px) !important;
              margin: 10px auto !important;
              padding: 15px !important;
            }
            
            /* 浮动按钮调整 */
            .back-to-top,
            .dark-mode-toggle {
              right: 10px !important;
              width: 45px !important;
              height: 45px !important;
            }
            
            .back-to-top {
              bottom: 60px !important;
            }
            
            .dark-mode-toggle {
              bottom: 10px !important;
            }
          }
          
          @media (max-width: 480px) {
            .memo {
              font-size: 14px !important;
              padding: 12px !important;
            }
            
            .memo .content {
              font-size: 14px !important;
            }
            
            header .top .filter button {
              font-size: 14px !important;
              padding: 10px !important;
            }
          }
        `;
        iframeDoc.head.appendChild(iframeMobileFix);

        // 3. 注入JavaScript修复到iframe
        const iframeScript = iframeDoc.createElement('script');
        iframeScript.textContent = `
          // iframe内部JavaScript修复
          (function() {
            function applyMobileFixes() {
              if (window.innerWidth <= 768) {
                // 强制应用body样式
                document.body.style.overflowX = 'hidden';
                document.body.style.maxWidth = '100vw';
                document.body.style.width = '100%';
                
                // 处理长文本
                const longElements = document.querySelectorAll('.memo .content a');
                longElements.forEach(el => {
                  if (el.textContent.length > 30) {
                    el.style.wordBreak = 'break-all';
                    el.style.overflowWrap = 'break-word';
                  }
                });
                
                // 处理所有容器
                const containers = document.querySelectorAll('header, .memos, .memo');
                containers.forEach(container => {
                  container.style.maxWidth = '100%';
                  container.style.width = '100%';
                });
              }
            }
            
            // 应用修复
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', applyMobileFixes);
            } else {
              applyMobileFixes();
            }
            
            // 窗口大小变化时重新应用
            window.addEventListener('resize', applyMobileFixes);
            
            // 监听DOM变化
            if (window.MutationObserver) {
              const observer = new MutationObserver(() => {
                setTimeout(applyMobileFixes, 100);
              });
              observer.observe(document.body, { childList: true, subtree: true });
            }
          })();
        `;
        iframeDoc.head.appendChild(iframeScript);

        console.log('iframe移动端修复已应用');
      } catch (e) {
        console.warn('无法访问iframe内容，可能是跨域限制:', e);
        
        // 如果是跨域iframe，尝试通过postMessage通信
        iframe.contentWindow.postMessage({
          type: 'MOBILE_FIX',
          css: `/* 移动端修复CSS */`,
          js: `/* 移动端修复JS */`
        }, '*');
      }
    });
  }

  // 4. 监听窗口大小变化
  function setupResizeListener() {
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        fixOuterLayout();
        fixHeightIssues(); // 窗口大小变化时也修复高度
      }, 100);
    });
  }

  // 5. 添加侧边栏切换优化
  function optimizeSidebarToggle() {
    const toggleButton = document.querySelector('.enhancer-buttons button');
    const sidebar = document.getElementById('sidebar');
    
    if (toggleButton && sidebar) {
      // 移动端下默认收起侧边栏
      if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
        toggleButton.textContent = '显示工具栏';
      }
      
      toggleButton.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          sidebar.classList.toggle('collapsed');
          toggleButton.textContent = sidebar.classList.contains('collapsed') 
            ? '显示工具栏' 
            : '隐藏工具栏';
        }
      });
    }
  }

  // 6. 专门修复高度问题
  function fixHeightIssues() {
    const container = document.getElementById('main-container');
    const iframeContainer = document.getElementById('iframe-container');
    const sidebar = document.getElementById('sidebar');
    const iframe = document.querySelector('iframe');
    
    if (!container || !iframeContainer) return;
    
    // 强制应用flex布局
    container.style.display = 'flex';
    container.style.height = 'calc(100vh - 60px)';
    container.style.overflow = 'hidden';
    
    if (window.innerWidth <= 768) {
      // 移动端垂直布局
      container.style.flexDirection = 'column';
      
      // iframe容器占满剩余空间
      iframeContainer.style.flex = '1';
      iframeContainer.style.display = 'flex';
      iframeContainer.style.flexDirection = 'column';
      iframeContainer.style.minHeight = '0';
      iframeContainer.style.order = '1';
      
      // 侧边栏限制高度
      if (sidebar) {
        sidebar.style.maxHeight = '200px';
        sidebar.style.overflowY = 'auto';
        sidebar.style.flexShrink = '0';
        sidebar.style.order = '2';
      }
    } else {
      // 桌面端水平布局
      container.style.flexDirection = 'row';
      
      iframeContainer.style.flex = '1';
      iframeContainer.style.display = 'flex';
      iframeContainer.style.minHeight = '0';
      
      if (sidebar) {
        sidebar.style.maxHeight = 'none';
        sidebar.style.width = '250px';
        sidebar.style.flexShrink = '0';
      }
    }
    
    // iframe填满容器
    if (iframe) {
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.flex = '1';
      iframe.style.minHeight = '0';
      iframe.style.border = 'none';
    }
    
    console.log('高度修复已应用');
  }

  // 主初始化函数
  function init() {
    ensureViewport();
    fixOuterLayout();
    fixHeightIssues(); // 添加高度修复
    fixIframeContent();
    setupResizeListener();
    optimizeSidebarToggle();
    
    console.log('flomo增强版移动端修复已加载');
  }

  // 7. 强制刷新iframe高度（用于解决加载后的高度问题）
  function forceRefreshIframeHeight() {
    setTimeout(() => {
      fixHeightIssues();
      
      // 触发iframe重新计算高度
      const iframe = document.querySelector('iframe');
      if (iframe) {
        const src = iframe.src;
        iframe.src = '';
        setTimeout(() => {
          iframe.src = src;
        }, 100);
      }
    }, 500);
  }

  // DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // 页面完全加载后再次修复高度
  window.addEventListener('load', () => {
    setTimeout(() => {
      fixHeightIssues();
      console.log('页面加载完成，高度再次修复');
    }, 1000);
  });
  
  // 暴露到全局，便于手动调用
  window.fixHeightIssues = fixHeightIssues;

})();