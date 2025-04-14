// 加载分享功能
(function() {
  // 等待主页面加载完成
  window.addEventListener('load', function() {
    // 加载html2canvas库
    loadExternalScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
    
    // 加载分享卡片功能
    setTimeout(() => {
      loadShareCardScript();
    }, 2000);
  });
  
  // 加载外部脚本
  function loadExternalScript(url) {
    const script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);
  }
  
  // 加载分享卡片脚本
  function loadShareCardScript() {
    let scriptPath;
    // 确定正确的脚本路径
    if (window.location.pathname === '/flomo-enhanced') {
      scriptPath = '/flomo/share-card.js';
    } else {
      scriptPath = 'share-card.js';
    }
    
    loadExternalScript(scriptPath);
  }
})(); 