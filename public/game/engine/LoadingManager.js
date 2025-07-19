/**
 * 加载屏幕管理器
 * 负责显示资源加载进度和状态
 */
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.gameContent = document.getElementById('game-content');
        this.errorScreen = document.getElementById('error-screen');
        this.retryBtn = document.getElementById('retry-btn');
        
        this.progressBar = null;
        this.progressText = null;
        this.statusText = null;
        
        this._initializeLoadingUI();
        this._bindEvents();
    }
    
    /**
     * 初始化加载界面UI
     */
    _initializeLoadingUI() {
        // 创建进度条容器
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        // 创建进度条
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        this.progressBar.appendChild(progressFill);
        
        // 创建进度文本
        this.progressText = document.createElement('div');
        this.progressText.className = 'progress-text';
        this.progressText.textContent = '0%';
        
        // 创建状态文本
        this.statusText = document.createElement('div');
        this.statusText.className = 'status-text';
        this.statusText.textContent = '正在初始化...';
        
        // 组装UI
        progressContainer.appendChild(this.progressBar);
        progressContainer.appendChild(this.progressText);
        progressContainer.appendChild(this.statusText);
        
        // 插入到加载屏幕
        const spinner = this.loadingScreen.querySelector('.loading-spinner');
        if (spinner && spinner.nextSibling) {
            this.loadingScreen.insertBefore(progressContainer, spinner.nextSibling);
        } else {
            this.loadingScreen.appendChild(progressContainer);
        }
    }
    
    /**
     * 绑定事件
     */
    _bindEvents() {
        if (this.retryBtn) {
            this.retryBtn.addEventListener('click', () => {
                this.hideError();
                this.showLoading();
                // 触发重新加载事件
                window.dispatchEvent(new CustomEvent('game-retry'));
            });
        }
    }
    
    /**
     * 显示加载屏幕
     */
    showLoading() {
        this.loadingScreen.style.display = 'flex';
        this.gameContent.style.display = 'none';
        this.errorScreen.style.display = 'none';
        
        this.updateProgress(0, 0, '正在初始化...');
    }
    
    /**
     * 隐藏加载屏幕，显示游戏内容
     */
    hideLoading() {
        this.loadingScreen.style.display = 'none';
        this.gameContent.style.display = 'block';
        this.errorScreen.style.display = 'none';
    }
    
    /**
     * 显示错误屏幕
     * @param {string} message 错误消息
     */
    showError(message = '游戏加载失败') {
        this.loadingScreen.style.display = 'none';
        this.gameContent.style.display = 'none';
        this.errorScreen.style.display = 'flex';
        
        const errorMessage = this.errorScreen.querySelector('.error-message p');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }
    
    /**
     * 隐藏错误屏幕
     */
    hideError() {
        this.errorScreen.style.display = 'none';
    }
    
    /**
     * 更新加载进度
     * @param {number} loaded 已加载数量
     * @param {number} total 总数量
     * @param {string} currentAsset 当前加载的资源
     */
    updateProgress(loaded, total, currentAsset = '') {
        const percentage = total > 0 ? Math.round((loaded / total) * 100) : 0;
        
        // 更新进度条
        if (this.progressBar) {
            const progressFill = this.progressBar.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = `${percentage}%`;
            }
        }
        
        // 更新进度文本
        if (this.progressText) {
            this.progressText.textContent = `${percentage}%`;
        }
        
        // 更新状态文本
        if (this.statusText) {
            if (currentAsset) {
                this.statusText.textContent = `正在加载: ${currentAsset} (${loaded}/${total})`;
            } else if (loaded === total && total > 0) {
                this.statusText.textContent = '加载完成！';
            } else {
                this.statusText.textContent = `正在加载资源... (${loaded}/${total})`;
            }
        }
    }
    
    /**
     * 设置加载状态文本
     * @param {string} status 状态文本
     */
    setStatus(status) {
        if (this.statusText) {
            this.statusText.textContent = status;
        }
    }
    
    /**
     * 显示加载完成动画
     */
    showLoadComplete() {
        this.setStatus('加载完成！正在启动游戏...');
        
        // 添加完成动画效果
        if (this.progressBar) {
            this.progressBar.classList.add('complete');
        }
        
        // 延迟隐藏加载屏幕
        setTimeout(() => {
            this.hideLoading();
        }, 1000);
    }
    
    /**
     * 重置加载状态
     */
    reset() {
        this.updateProgress(0, 0, '');
        
        if (this.progressBar) {
            this.progressBar.classList.remove('complete');
        }
    }
}

// 导出类
window.LoadingManager = LoadingManager;