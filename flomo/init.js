// flomo功能增强初始化脚本
(function() {
  'use strict';

  // 等待页面加载完成
  document.addEventListener('DOMContentLoaded', function() {
    console.log("flomo增强功能初始化中...");
    
    // 在全局对象上标记脚本加载状态
    window.flomoEnhanced = {
      loaded: {
        shareCard: false,
        feedMode: false,
        feedStyle: false,
        feedTemplate: false,
        feedFunctions: false
      },
      errors: []
    };
    
    // 加载分享卡片功能
    loadScript('flomo/share-card.js', function() {
      console.log("分享卡片功能已加载");
      window.flomoEnhanced.loaded.shareCard = true;
    });
    
    // 加载Feed模式功能
    loadScript('flomo/feed-main.js', function() {
      console.log("Feed模式主文件已加载");
      window.flomoEnhanced.loaded.feedMode = true;
      
      // 预加载Feed模式依赖文件
      setTimeout(() => {
        loadScript('flomo/feed-style.js', function() {
          console.log("Feed样式文件已预加载");
          window.flomoEnhanced.loaded.feedStyle = true;
        });
        
        loadScript('flomo/feed-template.js', function() {
          console.log("Feed模板文件已预加载");
          window.flomoEnhanced.loaded.feedTemplate = true;
        });
        
        loadScript('flomo/feed-functions.js', function() {
          console.log("Feed功能文件已预加载");
          window.flomoEnhanced.loaded.feedFunctions = true;
        });
      }, 2000);
    });
    
    console.log("flomo增强功能初始化完成");
  });

  // 加载外部脚本
  function loadScript(src, callback) {
    console.log("加载脚本:", src);
    
    // 检查是否已存在
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      console.log("脚本已存在:", src);
      if (callback) callback();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.async = false; // 按顺序加载
    
    if (callback) {
      script.onload = function() {
        console.log("脚本加载成功:", src);
        callback();
      };
    }
    
    script.onerror = function(error) {
      console.error("脚本加载失败:", src, error);
      if (window.flomoEnhanced && window.flomoEnhanced.errors) {
        window.flomoEnhanced.errors.push({
          script: src,
          time: new Date().toISOString(),
          error: error.message || "Unknown error"
        });
      }
    };
    
    document.head.appendChild(script);
  }
})(); 