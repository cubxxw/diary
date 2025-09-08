// 专门修复移动端右侧空白问题的脚本
(function() {
  'use strict';
  
  console.log('🔧 开始修复右侧空白问题...');
  
  function fixRightSpace() {
    // 强制所有容器元素使用100%宽度
    const elementsToFix = [
      'body',
      'html',
      '#main-container',
      '#iframe-container',
      '#sidebar',
      'iframe'
    ];
    
    elementsToFix.forEach(selector => {
      const elements = selector.startsWith('#') 
        ? [document.querySelector(selector)] 
        : document.querySelectorAll(selector);
      
      elements.forEach(element => {
        if (element) {
          element.style.width = '100%';
          element.style.maxWidth = '100%';
          element.style.minWidth = '0';
          element.style.margin = '0';
          element.style.boxSizing = 'border-box';
          
          // 特殊处理
          if (selector === 'body' || selector === 'html') {
            element.style.overflowX = 'hidden';
            element.style.maxWidth = '100vw';
          }
          
          if (selector === '#main-container') {
            element.style.display = 'flex';
            element.style.flexDirection = window.innerWidth <= 768 ? 'column' : 'row';
          }
          
          if (selector === 'iframe') {
            element.style.flex = '1';
            element.style.height = '100%';
            element.style.border = 'none';
          }
        }
      });
    });
    
    console.log('✅ 右侧空白修复完成');
  }
  
  // 立即执行
  fixRightSpace();
  
  // 窗口大小变化时重新执行
  window.addEventListener('resize', () => {
    setTimeout(fixRightSpace, 100);
  });
  
  // DOM变化监听
  if (window.MutationObserver) {
    const observer = new MutationObserver(() => {
      setTimeout(fixRightSpace, 200);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }
  
  // 定期检查
  setInterval(function() {
    const bodyWidth = document.body.offsetWidth;
    const windowWidth = window.innerWidth;
    
    if (bodyWidth > windowWidth) {
      console.log('⚠️ 检测到宽度溢出，重新修复');
      fixRightSpace();
    }
  }, 3000);
  
  // 暴露到全局
  window.fixRightSpace = fixRightSpace;
  
})();