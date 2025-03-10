document.addEventListener('DOMContentLoaded', function() {
    // 处理内容中的标签
    processContentTags();
    
    // 生成左侧标签列表
    generateTagSidebar();
    
    // 添加标签点击事件
    addTagClickEvents();
});

// 处理内容中的标签
function processContentTags() {
    const memoContents = document.querySelectorAll('.memo .content');
    
    memoContents.forEach(content => {
        // 查找并替换 #标签 格式的文本
        const html = content.innerHTML;
        const processedHtml = html.replace(/#(\w+)/g, '<span class="tag-highlight" data-tag="$1">#$1</span>');
        content.innerHTML = processedHtml;
    });
}

// 生成左侧标签列表
function generateTagSidebar() {
    // 收集所有标签
    const tags = {};
    document.querySelectorAll('.tag-highlight').forEach(tag => {
        const tagName = tag.getAttribute('data-tag');
        if (tagName) {
            tags[tagName] = (tags[tagName] || 0) + 1;
        }
    });
    
    // 创建标签列表
    const tagList = document.createElement('ul');
    tagList.className = 'tag-list';
    
    // 按标签数量排序
    const sortedTags = Object.entries(tags).sort((a, b) => b[1] - a[1]);
    
    sortedTags.forEach(([tagName, count]) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#" data-tag="${tagName}">
                <span>#${tagName}</span>
                <span class="tag-count">${count}</span>
            </a>
        `;
        tagList.appendChild(li);
    });
    
    // 添加到侧边栏
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        const tagSection = document.createElement('div');
        tagSection.className = 'tag-section';
        tagSection.innerHTML = '<h3><i class="fas fa-tags"></i> 标签</h3>';
        tagSection.appendChild(tagList);
        
        // 插入到侧边栏的顶部
        sidebar.insertBefore(tagSection, sidebar.firstChild);
    }
}

// 添加标签点击事件
function addTagClickEvents() {
    // 内容中的标签点击
    document.querySelectorAll('.tag-highlight').forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            const tagName = this.getAttribute('data-tag');
            filterByTag(tagName);
        });
    });
    
    // 侧边栏标签点击
    document.querySelectorAll('.tag-list a').forEach(tagLink => {
        tagLink.addEventListener('click', function(e) {
            e.preventDefault();
            const tagName = this.getAttribute('data-tag');
            filterByTag(tagName);
        });
    });
}

// 根据标签筛选内容
function filterByTag(tagName) {
    const memos = document.querySelectorAll('.memo');
    const activeTag = `data-tag="${tagName}"`;
    
    // 显示筛选状态
    const filterStatus = document.createElement('div');
    filterStatus.className = 'filter-status';
    filterStatus.innerHTML = `
        <div class="filter-info">
            <span>正在筛选: </span>
            <span class="tag-highlight">#${tagName}</span>
            <button class="clear-filter"><i class="fas fa-times"></i> 清除筛选</button>
        </div>
    `;
    
    // 移除旧的筛选状态
    const oldStatus = document.querySelector('.filter-status');
    if (oldStatus) {
        oldStatus.remove();
    }
    
    // 添加新的筛选状态
    const memosContainer = document.querySelector('.memos');
    memosContainer.insertBefore(filterStatus, memosContainer.firstChild);
    
    // 添加清除筛选按钮事件
    document.querySelector('.clear-filter').addEventListener('click', function() {
        memos.forEach(memo => {
            memo.style.display = 'block';
        });
        filterStatus.remove();
    });
    
    // 筛选备忘录
    memos.forEach(memo => {
        if (memo.innerHTML.includes(activeTag)) {
            memo.style.display = 'block';
        } else {
            memo.style.display = 'none';
        }
    });
}