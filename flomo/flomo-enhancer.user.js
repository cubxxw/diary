// ==UserScript==
// @name         Flomo 增强功能
// @namespace    https://github.com/cubxxw
// @version      1.0
// @description  为 Flomo 笔记添加搜索、暗黑模式等增强功能
// @author       cubxxw
// @match        file://*/flomo/cubxxw.html
// @match        *://*/*/flomo/cubxxw.html
// @match        *://*/*/cubxxw.html
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 搜索功能
    function createSearchBar() {
        const header = document.querySelector('header .top');
        if (!header) return;
        
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.style.marginBottom = '15px';
        searchContainer.style.display = 'flex';
        searchContainer.style.width = '100%';
        searchContainer.style.padding = '10px 0';
        
        const searchInput = document.createElement('input');
        searchInput.id = 'memo-search';
        searchInput.type = 'text';
        searchInput.placeholder = '搜索记录...';
        searchInput.style.padding = '8px 12px';
        searchInput.style.border = '1px solid #efefef';
        searchInput.style.borderRadius = '3px';
        searchInput.style.flex = '1';
        searchInput.style.marginRight = '10px';
        searchInput.style.fontSize = '14px';
        
        const searchButton = document.createElement('button');
        searchButton.textContent = '搜索';
        searchButton.style.padding = '8px 15px';
        searchButton.style.background = '#30cf79';
        searchButton.style.border = 'none';
        searchButton.style.borderRadius = '3px';
        searchButton.style.color = '#fff';
        searchButton.style.cursor = 'pointer';
        
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchButton);
        
        header.parentNode.insertBefore(searchContainer, header.nextSibling);
        
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // 执行搜索
    function performSearch() {
        const searchTerm = document.getElementById('memo-search').value.toLowerCase();
        if (!searchTerm) return;
        
        const memos = document.querySelectorAll('.memo');
        let found = false;
        
        memos.forEach(memo => {
            const content = memo.querySelector('.content').textContent.toLowerCase();
            if (content.includes(searchTerm)) {
                memo.style.display = 'block';
                highlightSearchTerm(memo, searchTerm);
                found = true;
            } else {
                memo.style.display = 'none';
            }
        });
        
        showSearchStatus(found, searchTerm);
    }
    
    // 高亮搜索词
    function highlightSearchTerm(memo, term) {
        const contentEl = memo.querySelector('.content');
        const html = contentEl.innerHTML;
        
        if (contentEl.originalContent) {
            contentEl.innerHTML = contentEl.originalContent;
        } else {
            contentEl.originalContent = html;
        }
        
        const regex = new RegExp(term, 'gi');
        contentEl.innerHTML = contentEl.innerHTML.replace(regex, match => 
            `<span style="background-color: #ffffa0; font-weight: bold;">${match}</span>`
        );
    }
    
    // 显示搜索状态
    function showSearchStatus(found, term) {
        const oldStatus = document.getElementById('search-status');
        if (oldStatus) {
            oldStatus.remove();
        }
        
        const status = document.createElement('div');
        status.id = 'search-status';
        status.style.padding = '10px';
        status.style.margin = '10px 0';
        status.style.borderRadius = '3px';
        status.style.fontSize = '14px';
        status.style.textAlign = 'center';
        
        if (found) {
            status.textContent = `已找到包含 "${term}" 的记录`;
            status.style.backgroundColor = '#e6f7ee';
            status.style.color = '#30cf79';
        } else {
            status.textContent = `没有找到包含 "${term}" 的记录`;
            status.style.backgroundColor = '#fff0f0';
            status.style.color = '#ff6b6b';
        }
        
        const resetButton = document.createElement('button');
        resetButton.textContent = '重置搜索';
        resetButton.style.marginLeft = '10px';
        resetButton.style.padding = '3px 8px';
        resetButton.style.border = '1px solid #ccc';
        resetButton.style.borderRadius = '3px';
        resetButton.style.background = '#f0f0f0';
        resetButton.style.cursor = 'pointer';
        
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
    
    // 暗黑模式切换
    function createDarkModeToggle() {
        const header = document.querySelector('header .top .filter');
        if (!header) return;
        
        const toggleButton = document.createElement('button');
        toggleButton.id = 'dark-mode-toggle';
        toggleButton.textContent = '🌙';
        toggleButton.title = '切换暗黑模式';
        toggleButton.style.marginLeft = '10px';
        toggleButton.style.padding = '9px 12px';
        toggleButton.style.background = '#efefef';
        toggleButton.style.borderRadius = '3px';
        toggleButton.style.border = 'none';
        toggleButton.style.cursor = 'pointer';
        
        header.appendChild(toggleButton);
        
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
        const tags = [];
        document.querySelectorAll('.memo .content p').forEach(p => {
            const text = p.textContent;
            if (text.startsWith('#')) {
                const tagName = text.trim().substring(1);
                if (tagName && !tags.includes(tagName)) {
                    tags.push(tagName);
                }
            }
        });
        
        if (tags.length === 0) return;
        
        const tagCloudContainer = document.createElement('div');
        tagCloudContainer.className = 'tag-cloud';
        tagCloudContainer.style.margin = '20px 0';
        tagCloudContainer.style.padding = '15px';
        tagCloudContainer.style.background = '#fff';
        tagCloudContainer.style.borderRadius = '6px';
        tagCloudContainer.style.border = '1px solid #f0f0f0';
        
        const title = document.createElement('h3');
        title.textContent = '标签云';
        title.style.marginBottom = '10px';
        title.style.fontSize = '16px';
        title.style.color = '#454545';
        
        tagCloudContainer.appendChild(title);
        
        const tagElements = document.createElement('div');
        tagElements.style.display = 'flex';
        tagElements.style.flexWrap = 'wrap';
        tagElements.style.gap = '8px';
        
        tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.textContent = tag;
            tagElement.style.padding = '5px 10px';
            tagElement.style.background = '#f5f5f5';
            tagElement.style.borderRadius = '15px';
            tagElement.style.fontSize = '12px';
            tagElement.style.color = '#30cf79';
            tagElement.style.cursor = 'pointer';
            
            tagElement.addEventListener('click', function() {
                filterByTag(tag);
            });
            
            tagElements.appendChild(tagElement);
        });
        
        tagCloudContainer.appendChild(tagElements);
        
        const memosContainer = document.querySelector('.memos');
        memosContainer.insertBefore(tagCloudContainer, memosContainer.firstChild);
    }
    
    // 按标签筛选
    function filterByTag(tagName) {
        const memos = document.querySelectorAll('.memo');
        let found = false;
        
        memos.forEach(memo => {
            const content = memo.querySelector('.content').textContent;
            if (content.includes('#' + tagName)) {
                memo.style.display = 'block';
                found = true;
            } else {
                memo.style.display = 'none';
            }
        });
        
        showFilterStatus(found, tagName);
    }
    
    // 显示筛选状态
    function showFilterStatus(found, tagName) {
        const oldStatus = document.getElementById('filter-status');
        if (oldStatus) {
            oldStatus.remove();
        }
        
        const status = document.createElement('div');
        status.id = 'filter-status';
        status.style.padding = '10px';
        status.style.margin = '10px 0';
        status.style.borderRadius = '3px';
        status.style.fontSize = '14px';
        status.style.textAlign = 'center';
        
        if (found) {
            status.textContent = `已筛选标签: #${tagName}`;
            status.style.backgroundColor = '#e6f7ee';
            status.style.color = '#30cf79';
        } else {
            status.textContent = `没有找到标签: #${tagName} 的记录`;
            status.style.backgroundColor = '#fff0f0';
            status.style.color = '#ff6b6b';
        }
        
        const resetButton = document.createElement('button');
        resetButton.textContent = '重置筛选';
        resetButton.style.marginLeft = '10px';
        resetButton.style.padding = '3px 8px';
        resetButton.style.border = '1px solid #ccc';
        resetButton.style.borderRadius = '3px';
        resetButton.style.background = '#f0f0f0';
        resetButton.style.cursor = 'pointer';
        
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
        backToTop.style.position = 'fixed';
        backToTop.style.bottom = '20px';
        backToTop.style.right = '20px';
        backToTop.style.width = '40px';
        backToTop.style.height = '40px';
        backToTop.style.borderRadius = '50%';
        backToTop.style.background = '#30cf79';
        backToTop.style.color = '#fff';
        backToTop.style.border = 'none';
        backToTop.style.fontSize = '20px';
        backToTop.style.lineHeight = '40px';
        backToTop.style.textAlign = 'center';
        backToTop.style.cursor = 'pointer';
        backToTop.style.display = 'none';
        backToTop.style.zIndex = '1000';
        
        document.body.appendChild(backToTop);
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 初始化所有功能
    function initEnhancer() {
        createSearchBar();
        createDarkModeToggle();
        enhanceLayout();
        createTagCloud();
        createBackToTopButton();
    }
    
    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancer);
    } else {
        initEnhancer();
    }
})(); 