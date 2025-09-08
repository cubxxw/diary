// 紧急高度修复脚本 - 专门解决iframe底部空白问题
(function() {
  'use strict';
  
  console.log('🚑 紧急高度修复开始...');
  
  function emergencyHeightFix() {
    const container = document.getElementById('main-container');
    const iframeContainer = document.getElementById('iframe-container');
    const sidebar = document.getElementById('sidebar');
    const header = document.getElementById('enhancer-header');
    const iframe = document.querySelector('iframe');
    
    if (!container || !iframeContainer || !iframe) {
      console.warn('关键元素未找到，跳过高度修复');
      return;
    }
    
    console.log('📏 开始高度计算和修复...');
    
    // 获取header高度
    const headerHeight = header ? header.offsetHeight : 60;
    console.log('Header高度:', headerHeight);
    
    // 计算可用高度
    const availableHeight = window.innerHeight - headerHeight;
    console.log('可用高度:', availableHeight);
    
    // 强制设置容器高度
    container.style.height = availableHeight + 'px';
    container.style.maxHeight = availableHeight + 'px';
    container.style.display = 'flex';
    container.style.overflow = 'hidden';
    container.style.position = 'relative';
    
    if (window.innerWidth <= 768) {
      // 移动端垂直布局
      console.log('📱 应用移动端布局');
      
      container.style.flexDirection = 'column';
      container.style.width = '100%';
      container.style.maxWidth = '100vw';
      
      // 侧边栏设置
      if (sidebar) {
        const sidebarCollapsed = sidebar.classList.contains('collapsed');
        if (sidebarCollapsed) {
          sidebar.style.height = '0px';
          sidebar.style.maxHeight = '0px';
          sidebar.style.overflow = 'hidden';
        } else {
          sidebar.style.height = '150px';
          sidebar.style.maxHeight = '150px';
          sidebar.style.overflowY = 'auto';
        }
        sidebar.style.width = '100%';
        sidebar.style.maxWidth = '100%';
        sidebar.style.flexShrink = '0';
        sidebar.style.order = '2';
      }
      
      // iframe容器设置
      const remainingHeight = sidebar && !sidebar.classList.contains('collapsed') 
        ? availableHeight - 150 
        : availableHeight;
      
      iframeContainer.style.height = remainingHeight + 'px';
      iframeContainer.style.maxHeight = remainingHeight + 'px';
      iframeContainer.style.width = '100%';
      iframeContainer.style.maxWidth = '100%';
      iframeContainer.style.flex = '1';
      iframeContainer.style.display = 'flex';
      iframeContainer.style.flexDirection = 'column';
      iframeContainer.style.overflow = 'hidden';
      iframeContainer.style.order = '1';
      
    } else {
      // 桌面端水平布局
      console.log('💻 应用桌面端布局');
      
      container.style.flexDirection = 'row';
      
      // 侧边栏设置
      if (sidebar) {
        sidebar.style.width = '250px';
        sidebar.style.height = availableHeight + 'px';
        sidebar.style.maxHeight = availableHeight + 'px';
        sidebar.style.overflowY = 'auto';
        sidebar.style.flexShrink = '0';
      }
      
      // iframe容器设置
      const remainingWidth = sidebar ? 'calc(100% - 250px)' : '100%';
      iframeContainer.style.width = remainingWidth;
      iframeContainer.style.height = availableHeight + 'px';
      iframeContainer.style.maxHeight = availableHeight + 'px';
      iframeContainer.style.flex = '1';
      iframeContainer.style.display = 'flex';
      iframeContainer.style.overflow = 'hidden';
    }
    
    // iframe最终设置
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.flex = '1';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    iframe.style.minHeight = '0';
    
    console.log('✅ 高度修复完成');
    console.log('容器高度:', container.offsetHeight);
    console.log('iframe容器高度:', iframeContainer.offsetHeight);
    console.log('iframe高度:', iframe.offsetHeight);
    
    // 通知修复完成
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'HEIGHT_FIX_COMPLETE',
        containerHeight: container.offsetHeight,
        iframeHeight: iframe.offsetHeight
      }, '*');
    }
  }
  
  // 监听侧边栏切换
  function watchSidebarToggle() {
    const toggleButtons = document.querySelectorAll('button');
    toggleButtons.forEach(button => {
      if (button.textContent.includes('工具栏') || button.textContent.includes('侧边栏')) {
        button.addEventListener('click', function() {
          setTimeout(emergencyHeightFix, 300);
        });
      }
    });
    
    // 监听侧边栏类变化
    const sidebar = document.getElementById('sidebar');
    if (sidebar && window.MutationObserver) {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(mutation => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            setTimeout(emergencyHeightFix, 100);
          }
        });
      });
      
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }
  
  // 窗口大小变化监听
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(emergencyHeightFix, 200);
  });
  
  // 初始化函数
  function init() {
    // 立即执行一次
    emergencyHeightFix();
    
    // 设置监听
    watchSidebarToggle();
    
    // 定期检查（防止其他脚本干扰）
    setInterval(function() {
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.offsetHeight < window.innerHeight * 0.5) {
        console.log('⚠️ 检测到高度异常，重新修复');
        emergencyHeightFix();
      }
    }, 5000);
    
    // 页面完全加载后再次修复
    setTimeout(emergencyHeightFix, 1000);
    setTimeout(emergencyHeightFix, 3000);
    
    console.log('🚑 紧急高度修复系统已启动');
  }
  
  // DOM准备就绪时执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // 页面加载完成后执行
  window.addEventListener('load', function() {
    setTimeout(emergencyHeightFix, 500);
  });
  
  // 暴露到全局
  window.emergencyHeightFix = emergencyHeightFix;
  
})();