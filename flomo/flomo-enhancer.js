// flomo 增强脚本 - 在不修改原始 HTML 的情况下添加功能

// DOM element cache for better performance
const domCache = {
  header: null,
  memosContainer: null,
  memos: null,
  searchInput: null,
  
  get(selector, refresh = false) {
    const cacheKey = selector.replace(/[^a-zA-Z0-9]/g, '_');
    if (!refresh && this[cacheKey]) {
      return this[cacheKey];
    }
    this[cacheKey] = document.querySelector(selector);
    return this[cacheKey];
  },
  
  getAll(selector, refresh = false) {
    const cacheKey = selector.replace(/[^a-zA-Z0-9]/g, '_') + '_all';
    if (!refresh && this[cacheKey]) {
      return this[cacheKey];
    }
    this[cacheKey] = document.querySelectorAll(selector);
    return this[cacheKey];
  }
};

document.addEventListener('DOMContentLoaded', function() {
  // 创建搜索框
  createSearchBar();
  
  // 添加暗黑模式切换按钮
  createDarkModeToggle();
  
  // 添加排版优化
  enhanceLayout();
  
  // 确保DOM完全加载后再处理标签
  setTimeout(() => {
    // 添加标签云
    createTagCloud();
    
    // 添加回到顶部按钮
    createBackToTopButton();
    
    console.log("增强功能已加载完成");
  }, 500);
});

// 创建搜索框功能
function createSearchBar() {
  const header = domCache.get('header .top');
  if (!header) return;
  
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  
  const searchInput = document.createElement('input');
  searchInput.id = 'memo-search';
  searchInput.type = 'text';
  searchInput.placeholder = '搜索记录...';
  searchInput.className = 'search-input';
  
  const searchButton = document.createElement('button');
  searchButton.textContent = '搜索';
  searchButton.className = 'search-button';
  
  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(searchButton);
  
  // 在 .top 元素后插入搜索框
  header.parentNode.insertBefore(searchContainer, header.nextSibling);
  
  // Cache search input for later use
  domCache.searchInput = searchInput;
  
  // 添加搜索功能
  searchButton.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
}

// 执行搜索
function performSearch() {
  const searchTerm = (domCache.searchInput || document.getElementById('memo-search')).value.toLowerCase();
  if (!searchTerm) return;
  
  const memos = domCache.getAll('.memo', true); // refresh memo cache
  let found = false;
  
  memos.forEach(memo => {
    const content = memo.querySelector('.content').textContent.toLowerCase();
    if (content.includes(searchTerm)) {
      memo.style.display = 'block';
      // 高亮搜索词
      highlightSearchTerm(memo, searchTerm);
      found = true;
    } else {
      memo.style.display = 'none';
    }
  });
  
  // 显示搜索结果状态
  showSearchStatus(found, searchTerm);
}

// 高亮搜索词
function highlightSearchTerm(memo, term) {
  const contentEl = memo.querySelector('.content');
  const html = contentEl.innerHTML;
  
  // 恢复原始内容（移除之前的高亮）
  if (contentEl.originalContent) {
    contentEl.innerHTML = contentEl.originalContent;
  } else {
    contentEl.originalContent = html;
  }
  
  // 添加新的高亮
  const regex = new RegExp(term, 'gi');
  contentEl.innerHTML = contentEl.innerHTML.replace(regex, match => 
    `<span style="background-color: #ffffa0; font-weight: bold;">${match}</span>`
  );
}

// 显示搜索状态
function showSearchStatus(found, term) {
  // 移除旧的状态消息
  const oldStatus = document.getElementById('search-status');
  if (oldStatus) {
    oldStatus.remove();
  }
  
  const status = document.createElement('div');
  status.id = 'search-status';
  status.className = `search-status ${found ? 'success' : 'error'}`;
  status.textContent = found ? `已找到包含 "${term}" 的记录` : `没有找到包含 "${term}" 的记录`;
  
  // 添加重置按钮
  const resetButton = document.createElement('button');
  resetButton.textContent = '重置搜索';
  resetButton.className = 'reset-button';
  
  resetButton.addEventListener('click', function() {
    document.getElementById('memo-search').value = '';
    document.querySelectorAll('.memo').forEach(memo => {
      memo.style.display = 'block';
      const contentEl = memo.querySelector('.content');
      if (contentEl.originalContent) {
        contentEl.innerHTML = contentEl.originalContent;
        delete contentEl.originalContent;
      }
    });
    status.remove();
  });
  
  status.appendChild(resetButton);
  
  const memosContainer = document.querySelector('.memos');
  memosContainer.insertBefore(status, memosContainer.firstChild);
}

// 创建暗黑模式切换按钮
function createDarkModeToggle() {
  const header = document.querySelector('header .top .filter');
  if (!header) return;
  
  const toggleButton = document.createElement('button');
  toggleButton.id = 'dark-mode-toggle';
  toggleButton.textContent = '🌙';
  toggleButton.title = '切换暗黑模式';
  toggleButton.className = 'dark-mode-toggle';
  
  header.appendChild(toggleButton);
  
  // 添加点击事件
  toggleButton.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
      this.textContent = '☀️';
      applyDarkMode();
    } else {
      this.textContent = '🌙';
      removeDarkMode();
    }
  });
}

// 应用暗黑模式
function applyDarkMode() {
  // 创建并应用暗黑模式样式
  const darkStyles = document.createElement('style');
  darkStyles.id = 'dark-mode-styles';
  darkStyles.textContent = `
    body.dark-mode {
      background: #222;
      color: #eee;
    }
    body.dark-mode header .logo {
      border-bottom: 1px solid #444;
    }
    body.dark-mode header .top .user .name {
      color: #eee;
    }
    body.dark-mode header .top .user .date {
      color: #aaa;
    }
    body.dark-mode .memo {
      background: #333;
      border: 1px solid #444;
    }
    body.dark-mode .memo:hover {
      box-shadow: 0px 2px 10px #000;
    }
    body.dark-mode .memo .time {
      color: #aaa;
    }
    body.dark-mode .memo .content {
      color: #ddd;
    }
    body.dark-mode .memo .files img {
      border: 1px solid #555;
    }
    body.dark-mode .custom-select {
      background: #444;
    }
    body.dark-mode .select-selected {
      background: #444;
      color: #ccc;
    }
    body.dark-mode .select-items {
      background: #333;
      box-shadow: 0px 4px 2px #111;
    }
    body.dark-mode .select-items div:hover,
    body.dark-mode .same-as-selected {
      background-color: #555;
    }
  `;
  
  document.head.appendChild(darkStyles);
}

// 移除暗黑模式
function removeDarkMode() {
  const darkStyles = document.getElementById('dark-mode-styles');
  if (darkStyles) {
    darkStyles.remove();
  }
}

// 增强页面布局
function enhanceLayout() {
  // 创建并应用增强布局样式
  const enhancedStyles = document.createElement('style');
  enhancedStyles.id = 'enhanced-layout-styles';
  enhancedStyles.textContent = `
    @media (min-width: 768px) {
      header, .memos {
        width: 720px;
      }
    }
    
    @media (max-width: 767px) {
      header, .memos {
        width: 90%;
      }
      header .top {
        flex-direction: column;
      }
      header .top .filter {
        margin-top: 20px;
      }
    }
    
    .memo {
      transition: all 0.2s ease;
      border: 1px solid #f0f0f0;
    }
    
    .memo .content p {
      line-height: 2;
    }
    
    .memo .content strong {
      color: #30cf79;
    }
    
    .memo .time {
      margin-bottom: 10px;
    }
    
    /* 改进分类标签的样式 */
    .memo .content a,
    .memo .content p:last-child {
      display: inline-block;
      color: #30cf79;
      text-decoration: none;
    }
  `;
  
  document.head.appendChild(enhancedStyles);
}

// 创建标签云
function createTagCloud() {
  // Tag cloud generation started
  
  // 收集所有标签
  const tags = [];
  
  // 直接获取所有memo内容
  const memoContents = document.querySelectorAll('.memo .content');
  // Found memo contents
  
  // 遍历所有笔记内容
  memoContents.forEach((content, index) => {
    // 获取所有段落
    const paragraphs = content.querySelectorAll('p');
    // 获取完整的文本内容
    const fullText = content.textContent;
    
    // Processing memo content
    
    // 使用更宽松的正则表达式匹配标签
    // 匹配#后面直到空白字符或行尾的所有内容
    const tagMatches = fullText.match(/#([^\s#]+)/g);
    
    if (tagMatches) {
      // Tags found in content
      
      tagMatches.forEach(tag => {
        const tagName = tag.substring(1); // 去除#符号
        if (tagName && !tags.includes(tagName)) {
          tags.push(tagName);
          // Adding unique tag
        }
      });
    }
  });
  
  // Total unique tags collected
  
  if (tags.length === 0) {
    // No tags found, skipping tag cloud creation
    return;
  }
  
  // 创建标签云容器
  const tagCloudContainer = document.createElement('div');
  tagCloudContainer.className = 'tag-cloud';
  
  const title = document.createElement('h3');
  title.textContent = '标签云';
  
  tagCloudContainer.appendChild(title);
  
  // 创建标签元素
  const tagElements = document.createElement('div');
  tagElements.className = 'tag-cloud-container';
  
  tags.forEach(tag => {
    const tagElement = document.createElement('span');
    tagElement.textContent = tag;
    tagElement.setAttribute('data-tag', tag);
    tagElement.className = 'tag-cloud-item';
    
    tagElement.addEventListener('click', function() {
      filterByTag(tag);
    });
    
    tagElements.appendChild(tagElement);
  });
  
  tagCloudContainer.appendChild(tagElements);
  
  // 添加到页面
  const memosContainer = document.querySelector('.memos');
  if (memosContainer) {
    memosContainer.insertBefore(tagCloudContainer, memosContainer.firstChild);
    // Tag cloud added to page
  } else {
    // Error: .memos container not found
  }
}

// 按标签筛选
function filterByTag(tagName) {
  // Filtering by tag
  const memos = document.querySelectorAll('.memo');
  let found = false;
  
  memos.forEach(memo => {
    // 获取完整文本内容
    const contentText = memo.querySelector('.content').textContent;
    
    // 检查完整文本是否包含标签（更简单可靠的方法）
    // 确保匹配完整标签而不是部分文本
    if (contentText.includes('#' + tagName) && 
        (contentText.includes('#' + tagName + ' ') || 
         contentText.includes('#' + tagName + '\n') || 
         contentText.endsWith('#' + tagName))) {
      memo.style.display = 'block';
      found = true;
      // Found matching memo
    } else {
      memo.style.display = 'none';
    }
  });
  
  // Filter operation completed
  
  // 显示筛选结果状态
  showFilterStatus(found, tagName);
}

// 显示筛选状态
function showFilterStatus(found, tagName) {
  // 移除旧的状态消息
  const oldStatus = document.getElementById('filter-status');
  if (oldStatus) {
    oldStatus.remove();
  }
  
  const status = document.createElement('div');
  status.id = 'filter-status';
  status.className = `filter-status ${found ? 'success' : 'error'}`;
  status.textContent = found ? `已筛选标签: #${tagName}` : `没有找到标签: #${tagName} 的记录`;
  
  // 添加重置按钮
  const resetButton = document.createElement('button');
  resetButton.textContent = '重置筛选';
  resetButton.className = 'reset-button';
  
  resetButton.addEventListener('click', function() {
    document.querySelectorAll('.memo').forEach(memo => {
      memo.style.display = 'block';
    });
    status.remove();
  });
  
  status.appendChild(resetButton);
  
  const memosContainer = document.querySelector('.memos');
  memosContainer.insertBefore(status, memosContainer.firstChild);
}

// 创建回到顶部按钮
function createBackToTopButton() {
  const backToTop = document.createElement('button');
  backToTop.id = 'back-to-top';
  backToTop.textContent = '↑';
  backToTop.title = '回到顶部';
  backToTop.className = 'back-to-top';
  
  document.body.appendChild(backToTop);
  
  // 添加滚动事件
  window.addEventListener('scroll', function() {
    backToTop.classList.toggle('visible', window.scrollY > 300);
  });
  
  // 添加点击事件
  backToTop.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
} 