// Feed模式主入口文件

(function() {
  'use strict';
  
  // 等待页面加载完成
  document.addEventListener('DOMContentLoaded', function() {
    console.log("Feed模式初始化中...");
    
    // 初始化Feed模式按钮
    initFeedModeButton();
    
    // 监听消息事件
    window.addEventListener('message', function(event) {
      if (event.data === 'activateFeedMode') {
        console.log("收到activateFeedMode消息");
        // 不要返回异步响应，直接执行
        activateFeedMode();
        // 发送确认消息
        if (event.source) {
          try {
            event.source.postMessage('feedModeActivated', '*');
          } catch (e) {
            console.error("无法发送响应:", e);
          }
        }
      }
    });
    
    // 导出全局函数
    window.activateFeedMode = activateFeedMode;
  });
  
  // 初始化Feed模式按钮
  function initFeedModeButton() {
    // 检查是否已存在
    if (document.getElementById('feed-mode-button-container')) {
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
    
    // 点击激活Feed模式
    feedButton.addEventListener('click', function() {
      console.log("点击Feed模式按钮");
      activateFeedMode();
    });
    
    buttonContainer.appendChild(feedButton);
    buttonContainer.appendChild(tooltip);
    document.body.appendChild(buttonContainer);
    
    console.log("Feed模式按钮已添加");
  }
  
  // 加载所需的脚本和样式
  function loadDependencies(callback) {
    console.log("加载Feed模式依赖...");
    
    // 检查是否已加载
    if (window.feedStylesContent && window.feedTemplates && window.feedFunctions) {
      console.log("依赖已加载，直接执行回调");
      callback();
      return;
    }
    
    // 加载顺序和计数器
    let loadedCount = 0;
    const totalFiles = 3;
    const baseUrl = getBaseUrl();
    
    console.log("使用基础URL:", baseUrl);
    
    // 加载样式文件
    loadScript(`${baseUrl}feed-style.js`, function() {
      console.log("样式文件已加载");
      checkAllLoaded();
    });
    
    // 加载模板文件
    loadScript(`${baseUrl}feed-template.js`, function() {
      console.log("模板文件已加载");
      checkAllLoaded();
    });
    
    // 加载函数文件
    loadScript(`${baseUrl}feed-functions.js`, function() {
      console.log("函数文件已加载");
      checkAllLoaded();
    });
    
    // 检查是否所有文件都已加载
    function checkAllLoaded() {
      loadedCount++;
      console.log(`已加载 ${loadedCount}/${totalFiles} 个文件`);
      
      if (loadedCount === totalFiles) {
        console.log("所有依赖已加载完成");
        // 额外检查全局变量是否真的可用
        if (window.feedStylesContent && window.feedTemplates && window.feedFunctions) {
          callback();
        } else {
          console.error("全局变量没有正确设置:",
            "feedStylesContent:", !!window.feedStylesContent,
            "feedTemplates:", !!window.feedTemplates,
            "feedFunctions:", !!window.feedFunctions
          );
          // 尝试再等一会儿
          setTimeout(function() {
            if (window.feedStylesContent && window.feedTemplates && window.feedFunctions) {
              callback();
            } else {
              console.error("依赖加载失败");
              alert("Feed模式依赖加载失败，请刷新页面后重试");
            }
          }, 1000);
        }
      }
    }
    
    // 加载脚本
    function loadScript(url, callback) {
      console.log("加载脚本:", url);
      
      // 检查是否已存在相同的脚本
      const existingScript = document.querySelector(`script[src="${url}"]`);
      if (existingScript) {
        console.log("脚本已存在:", url);
        callback();
        return;
      }
      
      const script = document.createElement('script');
      script.src = url;
      script.async = false; // 保证按顺序加载
      
      script.onload = function() {
        console.log("脚本加载成功:", url);
        callback();
      };
      
      script.onerror = function(e) {
        console.error("脚本加载失败:", url, e);
        // 仍然调用回调，以免一个脚本失败阻塞整个流程
        callback();
      };
      
      document.head.appendChild(script);
    }
    
    // 获取基础URL
    function getBaseUrl() {
      // 根据当前页面路径确定正确的基础URL
      if (window.location.pathname.includes('/flomo-enhanced')) {
        return '/flomo/';
      } else {
        return './';
      }
    }
  }
  
  // 激活Feed模式
  function activateFeedMode() {
    console.log("激活Feed模式...");
    
    // 获取所有笔记
    const memos = document.querySelectorAll('.memo');
    console.log("找到笔记数量:", memos.length);
    
    if (memos.length === 0) {
      console.error("未找到笔记内容");
      alert("无法找到笔记内容，请刷新页面后重试");
      return;
    }
    
    // 加载依赖
    loadDependencies(function() {
      try {
        console.log("初始化Feed模式对象");
        // 初始化并打开Feed模式
        window.feedFunctions.init(memos);
        window.feedFunctions.open();
        console.log("Feed模式已成功激活");
      } catch (error) {
        console.error("激活Feed模式时出错:", error);
        alert("激活Feed模式失败: " + error.message);
      }
    });
  }
  
  // 向文档添加一个标记，表示Feed模式已加载
  const metaTag = document.createElement('meta');
  metaTag.name = 'feed-mode-loaded';
  metaTag.content = 'true';
  document.head.appendChild(metaTag);
  
  console.log("Feed模式主入口文件已加载");
  
})(); 