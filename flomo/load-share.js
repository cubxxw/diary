// flomo功能加载器脚本
(function() {
  'use strict';

  // 等待页面加载完成
  document.addEventListener('DOMContentLoaded', function() {
    console.log("加载器初始化中...");
    
    // 动态加载功能脚本
    loadFeatures();
    
    // 在父窗口提供直接触发Feed模式的方法
    window.activateFeedModeDirectly = function() {
      console.log("直接激活Feed模式 - 从加载器");
      
      // 确保已加载Feed模式脚本
      if (!window.feedModeLoaded) {
        // 动态加载feed-mode.js
        const feedScript = document.createElement('script');
        feedScript.src = window.location.pathname.includes('/flomo-enhanced') 
          ? '/flomo/feed-mode.js' 
          : 'feed-mode.js';
        
        feedScript.onload = function() {
          console.log("Feed模式脚本加载成功");
          window.feedModeLoaded = true;
          
          // 脚本加载后，尝试调用Feed模式
          if (window.toggleFeedMode) {
            window.toggleFeedMode();
          } else {
            showToast("Feed模式加载失败，请刷新页面重试");
          }
        };
        
        document.head.appendChild(feedScript);
      } else if (window.toggleFeedMode) {
        // 如果已加载脚本，直接调用函数
        window.toggleFeedMode();
      }
    };
  });

  // 加载所有增强功能
  function loadFeatures() {
    // 首先加载分享卡片功能
    loadScript('share-card.js', function() {
      console.log("分享卡片功能已加载");
      
      // 然后加载Feed模式功能
      loadScript('feed-mode.js', function() {
        console.log("Feed模式功能已加载");
        window.feedModeLoaded = true;
      });
    });
  }

  // 通用脚本加载函数
  function loadScript(scriptName, callback) {
    const script = document.createElement('script');
    
    // 处理不同环境下的路径
    script.src = window.location.pathname.includes('/flomo-enhanced') 
      ? '/flomo/' + scriptName
      : scriptName;
      
    script.async = true;
    
    if (callback) {
      script.onload = callback;
    }
    
    document.head.appendChild(script);
    console.log("正在加载脚本: " + scriptName);
  }
  
  // 显示提示信息
  function showToast(message) {
    // 检查是否已有toast
    let toast = document.getElementById('feature-toast');
    
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'feature-toast';
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