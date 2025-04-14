// 笔记卡片分享功能
(function() {
  'use strict';

  // 等待页面加载完成
  document.addEventListener('DOMContentLoaded', function() {
    // 初始化分享功能
    initShareFeature();
  });

  // 初始化分享功能
  function initShareFeature() {
    // 等待iframe加载
    const checkIframe = setInterval(function() {
      const iframe = document.getElementById('content-frame');
      if (iframe && iframe.contentDocument) {
        clearInterval(checkIframe);
        
        // 获取iframe中的所有笔记卡片
        const memos = iframe.contentDocument.querySelectorAll('.memo');
        if (memos.length === 0) return;
        
        // 为每个卡片添加三点菜单
        memos.forEach(function(memo, index) {
          addCardMenu(memo, index);
        });
        
        // 创建分享模态框
        createShareModal();
        
        // 加载必要的库
        loadHtml2Canvas();
        loadPrismJS(); // 加载语法高亮库
      }
    }, 1000);
  }

  // 为每个笔记卡片添加三点菜单
  function addCardMenu(memo, index) {
    // 检查是否已经添加过菜单
    if (memo.querySelector('.memo-menu-container')) {
      return;
    }
  
    // 创建三点菜单容器
    const menuContainer = document.createElement('div');
    menuContainer.className = 'memo-menu-container';
    menuContainer.style.position = 'absolute';
    menuContainer.style.top = '10px';
    menuContainer.style.right = '10px';
    menuContainer.style.zIndex = '100'; // 确保足够高的z-index

    // 创建三点菜单按钮
    const menuButton = document.createElement('div');
    menuButton.className = 'memo-menu-button';
    menuButton.innerHTML = '⋮';
    menuButton.style.cursor = 'pointer';
    menuButton.style.fontSize = '20px'; // 增大字体使其更明显
    menuButton.style.width = '28px'; // 增大尺寸使其更明显
    menuButton.style.height = '28px'; // 增大尺寸使其更明显
    menuButton.style.borderRadius = '50%';
    menuButton.style.display = 'flex';
    menuButton.style.justifyContent = 'center';
    menuButton.style.alignItems = 'center';
    menuButton.style.color = '#666'; // 加深颜色使其更明显
    menuButton.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; // 添加背景使其更明显
    menuButton.style.transition = 'all 0.2s';
    menuButton.style.opacity = '0.9'; // 提高初始透明度
    menuButton.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; // 添加阴影提高可见度
    menuButton.dataset.memoId = index;
    
    // 鼠标悬停效果
    menuButton.addEventListener('mouseover', function() {
      this.style.backgroundColor = '#f0f0f0';
      this.style.opacity = '1';
      this.style.color = '#333';
    });
    
    menuButton.addEventListener('mouseout', function() {
      this.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      this.style.opacity = '0.9';
      this.style.color = '#666';
    });
    
    // 创建下拉菜单
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'memo-dropdown-menu';
    dropdownMenu.style.position = 'absolute';
    dropdownMenu.style.top = '100%';
    dropdownMenu.style.right = '0';
    dropdownMenu.style.backgroundColor = 'white';
    dropdownMenu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    dropdownMenu.style.borderRadius = '4px';
    dropdownMenu.style.padding = '5px 0';
    dropdownMenu.style.display = 'none';
    dropdownMenu.style.minWidth = '120px';
    dropdownMenu.style.zIndex = '10';
    
    // 分享选项
    const shareOption = document.createElement('div');
    shareOption.className = 'menu-option';
    shareOption.innerHTML = '分享 🔗';
    shareOption.style.padding = '8px 15px';
    shareOption.style.cursor = 'pointer';
    shareOption.style.fontSize = '14px';
    shareOption.style.transition = 'all 0.2s';
    
    shareOption.addEventListener('mouseover', function() {
      this.style.backgroundColor = '#f5f5f5';
    });
    
    shareOption.addEventListener('mouseout', function() {
      this.style.backgroundColor = 'transparent';
    });
    
    // 点击分享选项事件
    shareOption.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdownMenu.style.display = 'none';
      showShareModal(memo, index);
    });
    
    // 添加导出选项
    const exportOption = document.createElement('div');
    exportOption.className = 'menu-option';
    exportOption.innerHTML = '导出 📥';
    exportOption.style.padding = '8px 15px';
    exportOption.style.cursor = 'pointer';
    exportOption.style.fontSize = '14px';
    exportOption.style.transition = 'all 0.2s';
    
    exportOption.addEventListener('mouseover', function() {
      this.style.backgroundColor = '#f5f5f5';
    });
    
    exportOption.addEventListener('mouseout', function() {
      this.style.backgroundColor = 'transparent';
    });
    
    // 点击导出选项事件
    exportOption.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdownMenu.style.display = 'none';
      
      // 获取卡片内容并下载为文本文件
      const content = memo.querySelector('.content').textContent;
      const date = memo.querySelector('.time').textContent;
      const blob = new Blob([`${date}\n\n${content}`], {type: 'text/plain'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flomo-note-${date}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    
    // 添加菜单选项
    dropdownMenu.appendChild(shareOption);
    dropdownMenu.appendChild(exportOption);
    
    // 点击三点菜单显示/隐藏下拉菜单
    menuButton.addEventListener('click', function(e) {
      e.stopPropagation();
      if (dropdownMenu.style.display === 'none' || !dropdownMenu.style.display) {
        // 关闭其他所有打开的菜单
        document.querySelectorAll('.memo-dropdown-menu').forEach(menu => {
          menu.style.display = 'none';
        });
        dropdownMenu.style.display = 'block';
      } else {
        dropdownMenu.style.display = 'none';
      }
    });
    
    // 点击文档任意位置关闭菜单
    document.addEventListener('click', function() {
      dropdownMenu.style.display = 'none';
    });
    
    // 添加按钮和下拉菜单到容器
    menuContainer.appendChild(menuButton);
    menuContainer.appendChild(dropdownMenu);
    
    // 确保memo有相对定位，以便正确定位菜单
    memo.style.position = 'relative';
    
    // 添加菜单到笔记卡片
    memo.appendChild(menuContainer);
  }

  // 创建分享模态框
  function createShareModal() {
    // 检查是否已存在模态框
    if (document.getElementById('share-modal-container')) {
      return;
    }
    
    const modalContainer = document.createElement('div');
    modalContainer.id = 'share-modal-container';
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modalContainer.style.display = 'none';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';
    modalContainer.style.zIndex = '10000';
    
    // 模态框内容
    const modalContent = document.createElement('div');
    modalContent.id = 'share-modal-content';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '600px';
    modalContent.style.maxHeight = '80vh';
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = '8px';
    modalContent.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    modalContent.style.overflow = 'hidden';
    modalContent.style.position = 'relative';
    
    // 模态框头部
    const modalHeader = document.createElement('div');
    modalHeader.style.padding = '15px 20px';
    modalHeader.style.borderBottom = '1px solid #eee';
    modalHeader.style.display = 'flex';
    modalHeader.style.justifyContent = 'space-between';
    modalHeader.style.alignItems = 'center';
    
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = '分享笔记';
    modalTitle.style.margin = '0';
    modalTitle.style.fontSize = '18px';
    modalTitle.style.color = '#333';
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#999';
    closeButton.style.padding = '0 5px';
    
    closeButton.addEventListener('click', function() {
      modalContainer.style.display = 'none';
    });
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    
    // 模态框样式选择区
    const styleSelector = document.createElement('div');
    styleSelector.style.padding = '15px 20px';
    styleSelector.style.borderBottom = '1px solid #eee';
    
    const styleLabel = document.createElement('p');
    styleLabel.textContent = '选择分享样式：';
    styleLabel.style.marginBottom = '10px';
    styleLabel.style.color = '#666';
    
    const styleOptions = document.createElement('div');
    styleOptions.style.display = 'flex';
    styleOptions.style.gap = '10px';
    
    // 添加样式选项
    const styles = [
      { id: 'elegant', name: '优雅', color: '#30cf79' },
      { id: 'dark', name: '暗黑', color: '#333' },
      { id: 'gradient', name: '渐变', color: 'linear-gradient(135deg, #12c2e9, #c471ed, #f64f59)' },
      { id: 'minimal', name: '简约', color: '#f5f5f5' }
    ];
    
    styles.forEach(style => {
      const option = document.createElement('div');
      option.className = 'style-option';
      option.dataset.style = style.id;
      option.style.width = '60px';
      option.style.height = '60px';
      option.style.borderRadius = '8px';
      option.style.display = 'flex';
      option.style.justifyContent = 'center';
      option.style.alignItems = 'center';
      option.style.cursor = 'pointer';
      option.style.transition = 'transform 0.2s';
      option.style.border = '2px solid transparent';
      
      if (style.id === 'gradient') {
        option.style.background = style.color;
      } else {
        option.style.backgroundColor = style.color;
      }
      
      const optionText = document.createElement('span');
      optionText.textContent = style.name;
      
      if (style.id === 'minimal') {
        optionText.style.color = '#333';
      } else {
        optionText.style.color = 'white';
      }
      
      optionText.style.fontWeight = 'bold';
      
      option.appendChild(optionText);
      
      option.addEventListener('click', function() {
        document.querySelectorAll('.style-option').forEach(opt => {
          opt.style.border = '2px solid transparent';
          opt.style.transform = 'scale(1)';
        });
        
        this.style.border = '2px solid #30cf79';
        this.style.transform = 'scale(1.05)';
        
        // 更新预览区域样式
        updatePreviewStyle(this.dataset.style);
      });
      
      styleOptions.appendChild(option);
    });
    
    styleSelector.appendChild(styleLabel);
    styleSelector.appendChild(styleOptions);
    
    // 添加选项区域
    const optionsArea = document.createElement('div');
    optionsArea.style.padding = '0 20px 15px';
    optionsArea.style.borderBottom = '1px solid #eee';
    optionsArea.style.display = 'flex';
    optionsArea.style.gap = '15px';
    
    // 代码语法高亮选项
    const codeHighlightOption = document.createElement('div');
    codeHighlightOption.style.display = 'flex';
    codeHighlightOption.style.alignItems = 'center';
    
    const codeHighlightCheckbox = document.createElement('input');
    codeHighlightCheckbox.type = 'checkbox';
    codeHighlightCheckbox.id = 'code-highlight-option';
    codeHighlightCheckbox.checked = true; // 默认打开
    codeHighlightCheckbox.style.marginRight = '5px';
    
    const codeHighlightLabel = document.createElement('label');
    codeHighlightLabel.setAttribute('for', 'code-highlight-option');
    codeHighlightLabel.textContent = '代码语法高亮';
    codeHighlightLabel.style.fontSize = '14px';
    codeHighlightLabel.style.color = '#666';
    
    codeHighlightOption.appendChild(codeHighlightCheckbox);
    codeHighlightOption.appendChild(codeHighlightLabel);
    
    // 链接突出显示选项
    const linkHighlightOption = document.createElement('div');
    linkHighlightOption.style.display = 'flex';
    linkHighlightOption.style.alignItems = 'center';
    
    const linkHighlightCheckbox = document.createElement('input');
    linkHighlightCheckbox.type = 'checkbox';
    linkHighlightCheckbox.id = 'link-highlight-option';
    linkHighlightCheckbox.checked = true; // 默认打开
    linkHighlightCheckbox.style.marginRight = '5px';
    
    const linkHighlightLabel = document.createElement('label');
    linkHighlightLabel.setAttribute('for', 'link-highlight-option');
    linkHighlightLabel.textContent = '突出显示链接';
    linkHighlightLabel.style.fontSize = '14px';
    linkHighlightLabel.style.color = '#666';
    
    linkHighlightOption.appendChild(linkHighlightCheckbox);
    linkHighlightOption.appendChild(linkHighlightLabel);
    
    // 将选项添加到选项区域
    optionsArea.appendChild(codeHighlightOption);
    optionsArea.appendChild(linkHighlightOption);
    
    // 模态框预览区
    const previewArea = document.createElement('div');
    previewArea.id = 'share-preview-area';
    previewArea.style.padding = '20px';
    previewArea.style.maxHeight = '300px';
    previewArea.style.overflow = 'auto';
    
    // 分享卡片预览
    const shareCard = document.createElement('div');
    shareCard.id = 'share-card-preview';
    shareCard.style.padding = '20px';
    shareCard.style.borderRadius = '8px';
    shareCard.style.backgroundColor = '#30cf79';
    shareCard.style.color = 'white';
    shareCard.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    shareCard.style.transition = 'all 0.3s';
    
    const cardHeader = document.createElement('div');
    cardHeader.style.display = 'flex';
    cardHeader.style.justifyContent = 'space-between';
    cardHeader.style.marginBottom = '15px';
    
    const cardLogo = document.createElement('div');
    cardLogo.innerHTML = 'flomo 浮墨笔记';
    cardLogo.style.fontWeight = 'bold';
    
    const cardDate = document.createElement('div');
    cardDate.id = 'share-card-date';
    cardDate.style.fontSize = '14px';
    cardDate.style.opacity = '0.8';
    
    cardHeader.appendChild(cardLogo);
    cardHeader.appendChild(cardDate);
    
    const cardContent = document.createElement('div');
    cardContent.id = 'share-card-content';
    cardContent.style.fontSize = '16px';
    cardContent.style.lineHeight = '1.6';
    cardContent.style.margin = '15px 0';
    
    const cardFooter = document.createElement('div');
    cardFooter.style.display = 'flex';
    cardFooter.style.justifyContent = 'space-between';
    cardFooter.style.alignItems = 'center';
    cardFooter.style.marginTop = '15px';
    cardFooter.style.fontSize = '14px';
    
    const cardTags = document.createElement('div');
    cardTags.id = 'share-card-tags';
    
    const cardQRPlaceholder = document.createElement('div');
    cardQRPlaceholder.textContent = '扫码查看更多';
    cardQRPlaceholder.style.opacity = '0.8';
    
    cardFooter.appendChild(cardTags);
    cardFooter.appendChild(cardQRPlaceholder);
    
    shareCard.appendChild(cardHeader);
    shareCard.appendChild(cardContent);
    shareCard.appendChild(cardFooter);
    
    previewArea.appendChild(shareCard);
    
    // 模态框按钮区
    const buttonArea = document.createElement('div');
    buttonArea.style.padding = '15px 20px';
    buttonArea.style.borderTop = '1px solid #eee';
    buttonArea.style.display = 'flex';
    buttonArea.style.justifyContent = 'space-between';
    
    const downloadButton = document.createElement('button');
    downloadButton.textContent = '下载图片';
    downloadButton.style.backgroundColor = '#30cf79';
    downloadButton.style.color = 'white';
    downloadButton.style.border = 'none';
    downloadButton.style.borderRadius = '4px';
    downloadButton.style.padding = '8px 16px';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.fontWeight = 'bold';
    
    downloadButton.addEventListener('click', function() {
      // 使用html2canvas将卡片转为图片并下载
      if (typeof html2canvas !== 'undefined') {
        html2canvas(document.getElementById('share-card-preview')).then(canvas => {
          const link = document.createElement('a');
          link.download = 'flomo-card-' + new Date().getTime() + '.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        });
      } else {
        alert('正在加载转换工具，请稍后再试...');
        loadHtml2Canvas();
      }
    });
    
    const copyButton = document.createElement('button');
    copyButton.textContent = '复制文本';
    copyButton.style.backgroundColor = '#f5f5f5';
    copyButton.style.color = '#333';
    copyButton.style.border = '1px solid #ddd';
    copyButton.style.borderRadius = '4px';
    copyButton.style.padding = '8px 16px';
    copyButton.style.cursor = 'pointer';
    
    copyButton.addEventListener('click', function() {
      const textToCopy = document.getElementById('share-card-content').textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.textContent = '已复制!';
        setTimeout(() => {
          this.textContent = '复制文本';
        }, 2000);
      });
    });
    
    buttonArea.appendChild(copyButton);
    buttonArea.appendChild(downloadButton);
    
    // 组装模态框
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(styleSelector);
    modalContent.appendChild(optionsArea); // 添加选项区域
    modalContent.appendChild(previewArea);
    modalContent.appendChild(buttonArea);
    
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
    
    // 点击模态框外部关闭
    modalContainer.addEventListener('click', function(e) {
      if (e.target === this) {
        this.style.display = 'none';
      }
    });
    
    // 为选项添加更新事件
    codeHighlightCheckbox.addEventListener('change', updatePreview);
    linkHighlightCheckbox.addEventListener('change', updatePreview);
  }

  // 显示分享模态框
  function showShareModal(memo, memoId) {
    // 获取笔记内容
    const date = memo.querySelector('.time').textContent;
    const content = memo.querySelector('.content').innerHTML;
    
    // 提取标签
    const tags = [];
    const contentText = memo.querySelector('.content').textContent;
    const tagMatches = contentText.match(/#[\w\/]+/g);
    if (tagMatches) {
      tagMatches.forEach(tag => tags.push(tag));
    }
    
    // 设置卡片内容
    document.getElementById('share-card-date').textContent = date;
    document.getElementById('share-card-content').innerHTML = content;
    
    // 设置标签
    const tagsElement = document.getElementById('share-card-tags');
    tagsElement.innerHTML = '';
    
    if (tags.length > 0) {
      tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.textContent = tag;
        tagSpan.style.marginRight = '8px';
        tagsElement.appendChild(tagSpan);
      });
    }
    
    // 默认选中第一个样式
    const firstStyle = document.querySelector('.style-option');
    if (firstStyle) {
      firstStyle.click();
    }
    
    // 存储当前memo的引用，以便后续处理
    document.getElementById('share-modal-container').dataset.currentMemoId = memoId;
    
    // 显示模态框
    document.getElementById('share-modal-container').style.display = 'flex';
    
    // 应用语法高亮和链接处理
    updatePreview();
  }
  
  // 更新预览内容，包括语法高亮和链接处理
  function updatePreview() {
    const card = document.getElementById('share-card-preview');
    const content = document.getElementById('share-card-content');
    const codeHighlight = document.getElementById('code-highlight-option').checked;
    const linkHighlight = document.getElementById('link-highlight-option').checked;
    
    // 处理代码块
    if (codeHighlight) {
      applyCodeHighlight(content);
    } else {
      removeCodeHighlight(content);
    }
    
    // 处理链接
    if (linkHighlight) {
      highlightLinks(content);
    } else {
      normalizeLinks(content);
    }
  }
  
  // 应用代码语法高亮
  function applyCodeHighlight(contentElement) {
    const codeBlocks = contentElement.querySelectorAll('pre code');
    
    if (codeBlocks.length > 0 && window.Prism) {
      codeBlocks.forEach(block => {
        if (!block.classList.contains('prism-highlighted')) {
          Prism.highlightElement(block);
          block.classList.add('prism-highlighted');
        }
      });
    }
  }
  
  // 移除代码语法高亮
  function removeCodeHighlight(contentElement) {
    const codeBlocks = contentElement.querySelectorAll('pre code.prism-highlighted');
    
    codeBlocks.forEach(block => {
      block.classList.remove('prism-highlighted');
      block.className = 'language-none'; // 重置类名
      
      // 移除Prism添加的span元素
      const codeText = block.textContent;
      block.innerHTML = codeText;
    });
  }
  
  // 突出显示链接
  function highlightLinks(contentElement) {
    const links = contentElement.querySelectorAll('a');
    
    links.forEach(link => {
      if (!link.dataset.originalStyle) {
        link.dataset.originalStyle = link.style.cssText;
      }
      
      link.style.color = '#0366d6';
      link.style.textDecoration = 'underline';
      link.style.fontWeight = 'bold';
    });
  }
  
  // 恢复链接正常显示
  function normalizeLinks(contentElement) {
    const links = contentElement.querySelectorAll('a');
    
    links.forEach(link => {
      if (link.dataset.originalStyle) {
        link.style.cssText = link.dataset.originalStyle;
      } else {
        link.style.color = '';
        link.style.textDecoration = '';
        link.style.fontWeight = '';
      }
    });
  }

  // 更新预览样式
  function updatePreviewStyle(styleId) {
    const card = document.getElementById('share-card-preview');
    
    // 重置样式
    card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    card.style.border = 'none';
    
    switch (styleId) {
      case 'elegant':
        card.style.backgroundColor = '#30cf79';
        card.style.color = 'white';
        break;
        
      case 'dark':
        card.style.backgroundColor = '#333';
        card.style.color = 'white';
        break;
        
      case 'gradient':
        card.style.background = 'linear-gradient(135deg, #12c2e9, #c471ed, #f64f59)';
        card.style.color = 'white';
        break;
        
      case 'minimal':
        card.style.backgroundColor = '#f5f5f5';
        card.style.color = '#333';
        card.style.boxShadow = 'none';
        card.style.border = '1px solid #ddd';
        break;
    }
    
    // 在样式变更后更新预览内容
    updatePreview();
  }

  // 加载html2canvas库
  function loadHtml2Canvas() {
    if (typeof html2canvas === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
      document.head.appendChild(script);
    }
  }
  
  // 加载Prism.js语法高亮库
  function loadPrismJS() {
    if (typeof Prism === 'undefined') {
      // 加载Prism.js脚本
      const prismScript = document.createElement('script');
      prismScript.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js';
      document.head.appendChild(prismScript);
      
      // 加载Prism.js样式
      const prismCss = document.createElement('link');
      prismCss.rel = 'stylesheet';
      prismCss.href = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css';
      document.head.appendChild(prismCss);
      
      // 加载常用语言支持
      setTimeout(() => {
        const languagesScript = document.createElement('script');
        languagesScript.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-javascript.min.js';
        document.head.appendChild(languagesScript);
        
        const cssScript = document.createElement('script');
        cssScript.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-css.min.js';
        document.head.appendChild(cssScript);
        
        const pythonScript = document.createElement('script');
        pythonScript.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-python.min.js';
        document.head.appendChild(pythonScript);
      }, 500);
    }
  }

})(); 