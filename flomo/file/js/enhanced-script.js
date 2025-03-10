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

    // 为每个memo添加点击事件
    document.querySelectorAll('.memo').forEach(memo => {
        memo.addEventListener('click', function() {
            // 获取memo内容
            const time = this.querySelector('.time').textContent;
            const content = this.querySelector('.content').innerHTML;
            
            // 填充沉浸式视图
            document.querySelector('.immersive-time').textContent = time;
            document.querySelector('.immersive-body').innerHTML = content;
            
            // 显示沉浸式视图
            document.getElementById('immersive-view').classList.add('active');
        });
    });
    
    // 关闭沉浸式视图
    document.getElementById('immersive-close').addEventListener('click', function() {
        document.getElementById('immersive-view').classList.remove('active');
    });
    
    // 复制文本功能
    document.getElementById('copy-text-btn').addEventListener('click', function() {
        const text = document.querySelector('.immersive-body').textContent;
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('文本已复制到剪贴板');
            })
            .catch(err => {
                console.error('复制失败: ', err);
            });
    });
}); 