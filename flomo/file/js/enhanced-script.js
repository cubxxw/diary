// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 创建沉浸式视图元素
    if (!document.getElementById('immersive-view')) {
        const immersiveView = document.createElement('div');
        immersiveView.className = 'immersive-view';
        immersiveView.id = 'immersive-view';
        immersiveView.innerHTML = `
            <div class="immersive-content">
                <button class="immersive-close" id="immersive-close">&times;</button>
                <div class="immersive-time"></div>
                <div class="immersive-body"></div>
                <div class="immersive-actions">
                    <button class="copy-text-btn" id="copy-text-btn">
                        <i class="fas fa-copy"></i> 复制文本
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(immersiveView);
    }

    // 添加视口元数据，确保移动设备正确缩放
    if (!document.querySelector('meta[name="viewport"]')) {
        const metaViewport = document.createElement('meta');
        metaViewport.name = 'viewport';
        metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(metaViewport);
    }
    
    // 处理长URL和无法断开的长字符串，防止布局溢出
    function handleLongContent() {
        // 找出所有可能包含长URL或长字符串的元素
        const contentElements = document.querySelectorAll('.memo .content p, .memo .content a, .immersive-body p, .immersive-body a');
        
        contentElements.forEach(element => {
            // 处理长URL
            if (element.tagName === 'A' && element.textContent.length > 30) {
                // 使用省略号显示长URL
                const url = element.textContent;
                const shortUrl = url.substring(0, 15) + '...' + url.substring(url.length - 15);
                element.setAttribute('title', url); // 保留完整URL为提示
                element.textContent = shortUrl;
            }
            
            // 查找并包装长非空格字符串
            if (element.innerHTML) {
                // 寻找超过25个字符且没有空格或标点的字符串
                const longWordRegex = /(\S{25,})/g;
                element.innerHTML = element.innerHTML.replace(longWordRegex, function(match) {
                    // 在CSS中使用word-break确保这些可以断行
                    return '<span class="long-text">' + match + '</span>';
                });
            }
        });
    }
    
    // 初始处理长内容
    handleLongContent();
    
    // 当DOM改变时重新处理（例如动态加载内容后）
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            handleLongContent();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 为每个memo添加点击事件
    document.querySelectorAll('.memo').forEach(memo => {
        memo.addEventListener('click', function() {
            // 获取memo内容
            const time = this.querySelector('.time').textContent;
            const content = this.querySelector('.content').innerHTML;
            
            // 填充沉浸式视图
            document.querySelector('.immersive-time').textContent = time;
            document.querySelector('.immersive-body').innerHTML = content;
            
            // 处理沉浸式视图中的长内容
            handleLongContent();
            
            // 显示沉浸式视图
            document.getElementById('immersive-view').classList.add('active');
            document.body.classList.add('immersive-active'); // 防止背景滚动
        });
    });
    
    // 关闭沉浸式视图
    document.getElementById('immersive-close').addEventListener('click', function() {
        document.getElementById('immersive-view').classList.remove('active');
        document.body.classList.remove('immersive-active');
    });
    
    // 复制文本功能
    document.getElementById('copy-text-btn').addEventListener('click', function() {
        const text = document.querySelector('.immersive-body').textContent;
        navigator.clipboard.writeText(text)
            .then(() => {
                // 创建临时反馈元素而不是使用alert
                const feedback = document.createElement('div');
                feedback.textContent = '文本已复制';
                feedback.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.7);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 20px;
                    z-index: 1000;
                    font-size: 14px;
                `;
                document.body.appendChild(feedback);
                
                // 2秒后移除
                setTimeout(() => {
                    feedback.style.opacity = '0';
                    feedback.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => document.body.removeChild(feedback), 500);
                }, 2000);
            })
            .catch(err => {
                // Copy operation failed
            });
    });

    // 添加滑动关闭沉浸式视图功能
    const immersiveView = document.getElementById('immersive-view');
    let startY, startTime;
    const minSwipeDistance = 100;
    const maxSwipeTime = 300;

    immersiveView.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        startTime = Date.now();
    }, { passive: true });

    immersiveView.addEventListener('touchend', function(e) {
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();
        const distance = endY - startY;
        const duration = endTime - startTime;

        // 向下滑动且速度足够快时关闭
        if (distance > minSwipeDistance && duration < maxSwipeTime) {
            immersiveView.classList.remove('active');
            document.body.classList.remove('immersive-active');
        }
    }, { passive: true });
    
    // 检测设备类型并应用特定样式
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.body.classList.add('mobile-device');
    }
}); 