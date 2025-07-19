/**
 * Grow Garden Game - 主游戏文件
 * 使用新的GameEngine架构
 */

class GrowGardenGame {
    constructor() {
        this.gameEngine = null;
        this.isInitialized = false;
        this.isLoading = true;
        
        // DOM 元素引用
        this.elements = {};
        
        // 资源管理器
        this.assetManager = null;
        this.loadingManager = null;
        
        // UI更新定时器
        this.uiUpdateInterval = null;
        
        // iframe通信相关
        this.isInIframe = window.self !== window.top;
        this.parentOrigin = '*'; // 在生产环境中应该设置为具体的域名
        this.messageHandlers = new Map();
        
        // 错误处理
        this.errorCount = 0;
        this.maxRetries = 3;
        this.lastError = null;
        
        // 绑定方法上下文
        this.handleToolSelect = this.handleToolSelect.bind(this);
        this.handlePlantSelect = this.handlePlantSelect.bind(this);
        this.handleRetry = this.handleRetry.bind(this);
        this.updateUI = this.updateUI.bind(this);
        this.handleParentMessage = this.handleParentMessage.bind(this);
        this.handleWindowError = this.handleWindowError.bind(this);
        this.handleUnhandledRejection = this.handleUnhandledRejection.bind(this);
        
        // 设置全局错误处理
        this.setupGlobalErrorHandling();
        
        // 设置iframe通信
        if (this.isInIframe) {
            this.setupIframeComm();
        }
    }
    
    /**
     * 设置全局错误处理
     */
    setupGlobalErrorHandling() {
        // 捕获未处理的JavaScript错误
        window.addEventListener('error', this.handleWindowError);
        
        // 捕获未处理的Promise拒绝
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    }
    
    /**
     * 设置iframe通信
     */
    setupIframeComm() {
        console.log('设置iframe通信...');
        
        // 监听来自父页面的消息
        window.addEventListener('message', this.handleParentMessage);
        
        // 注册消息处理器
        this.registerMessageHandlers();
        
        // 通知父页面游戏已准备就绪
        this.sendMessageToParent('gameReady', {
            timestamp: Date.now(),
            version: '1.0.0'
        });
    }
    
    /**
     * 注册消息处理器
     */
    registerMessageHandlers() {
        // 处理父页面的游戏控制命令
        this.messageHandlers.set('pauseGame', (data) => {
            if (this.gameEngine) {
                this.gameEngine.pause();
                this.sendMessageToParent('gamePaused', { timestamp: Date.now() });
            }
        });
        
        this.messageHandlers.set('resumeGame', (data) => {
            if (this.gameEngine) {
                this.gameEngine.resume();
                this.sendMessageToParent('gameResumed', { timestamp: Date.now() });
            }
        });
        
        this.messageHandlers.set('resetGame', (data) => {
            this.resetGame();
        });
        
        this.messageHandlers.set('getGameState', (data) => {
            const gameState = this.gameEngine?.getGameState();
            if (gameState) {
                const stats = gameState.getGameStats();
                this.sendMessageToParent('gameStateResponse', {
                    stats,
                    isInitialized: this.isInitialized,
                    isLoading: this.isLoading,
                    timestamp: Date.now()
                });
            }
        });
        
        // 处理父页面的尺寸调整
        this.messageHandlers.set('resizeGame', (data) => {
            if (data.width && data.height) {
                this.resizeGame(data.width, data.height);
            }
        });
    }
    
    /**
     * 初始化游戏
     */
    async init() {
        try {
            console.log('开始初始化 Grow Garden 游戏...');
            
            // 通知父页面开始加载
            this.sendMessageToParent('gameLoadingStart', {
                timestamp: Date.now()
            });
            
            // 获取DOM元素
            this.getDOMElements();
            
            // 模拟资源加载
            await this.loadGameResources();
            
            // 初始化游戏引擎
            await this.initializeGameEngine();
            
            // 设置UI事件监听器
            this.setupUIEventListeners();
            
            // 隐藏加载屏幕，显示游戏内容
            this.showGameContent();
            
            // 启动游戏引擎
            this.gameEngine.start();
            
            // 开始UI更新循环
            this.startUIUpdateLoop();
            
            this.isInitialized = true;
            this.errorCount = 0; // 重置错误计数
            console.log('游戏初始化完成');
            
            // 通知父页面游戏加载完成
            this.sendMessageToParent('gameLoadingComplete', {
                timestamp: Date.now(),
                success: true
            });
            
        } catch (error) {
            console.error('游戏初始化失败:', error);
            this.handleGameError(error, 'initialization');
        }
    }
    
    /**
     * 获取DOM元素引用
     */
    getDOMElements() {
        this.elements = {
            loadingScreen: document.getElementById('loading-screen'),
            gameContent: document.getElementById('game-content'),
            errorScreen: document.getElementById('error-screen'),
            canvas: document.getElementById('game-canvas'),
            scoreDisplay: document.getElementById('score'),
            plantsDisplay: document.getElementById('plants-count'),
            harvestDisplay: document.getElementById('harvest-count'),
            gameTimeDisplay: document.getElementById('game-time'),
            levelDisplay: document.getElementById('level-info'),
            currentToolDisplay: document.getElementById('current-tool'),
            selectedPlantDisplay: document.getElementById('selected-plant'),
            toolButtons: document.querySelectorAll('.tool-btn'),
            plantButtons: document.querySelectorAll('.plant-btn'),
            retryBtn: document.getElementById('retry-btn')
        };
        
        // 验证必要元素是否存在
        if (!this.elements.canvas) {
            throw new Error('Canvas元素未找到');
        }
    }
    
    /**
     * 加载游戏资源
     */
    async loadGameResources() {
        console.log('开始加载游戏资源...');
        
        try {
            // 初始化加载管理器
            this.loadingManager = new LoadingManager();
            this.loadingManager.showLoading();
            
            // 初始化资源管理器
            this.assetManager = new AssetManager();
            
            // 设置资源加载事件监听器
            this.assetManager.setEventListeners(
                // 进度回调
                (loaded, total, currentAsset) => {
                    this.loadingManager.updateProgress(loaded, total, currentAsset);
                },
                // 完成回调
                () => {
                    console.log('所有资源加载完成');
                    this.loadingManager.showLoadComplete();
                },
                // 错误回调
                (error) => {
                    console.error('资源加载出错:', error);
                    this.loadingManager.showError('资源加载失败，请检查网络连接');
                }
            );
            
            // 开始加载所有资源
            await this.assetManager.loadAllAssets();
            
            console.log('游戏资源加载完成');
            
        } catch (error) {
            console.error('资源加载失败:', error);
            if (this.loadingManager) {
                this.loadingManager.showError('资源加载失败，请重试');
            }
            throw error;
        }
    }
    
    /**
     * 初始化游戏引擎
     */
    async initializeGameEngine() {
        console.log('初始化游戏引擎...');
        
        // 创建游戏引擎实例
        this.gameEngine = new GameEngine('game-canvas', this.assetManager);
        
        // 初始化游戏引擎
        await this.gameEngine.init();
        
        // 连接输入处理器与UI
        this.connectInputHandlerToUI();
        
        console.log('游戏引擎初始化完成');
    }
    
    /**
     * 连接输入处理器与UI
     */
    connectInputHandlerToUI() {
        const inputHandler = this.gameEngine.getInputHandler();
        if (!inputHandler) return;
        
        // 同步初始工具和植物选择
        const activeToolBtn = document.querySelector('.tool-btn.active');
        const activePlantBtn = document.querySelector('.plant-btn.active');
        
        if (activeToolBtn) {
            inputHandler.setSelectedTool(activeToolBtn.dataset.tool);
        }
        
        if (activePlantBtn) {
            inputHandler.setSelectedPlantType(activePlantBtn.dataset.plant);
        }
    }
    
    /**
     * 设置UI事件监听器
     */
    setupUIEventListeners() {
        // 工具按钮点击
        this.elements.toolButtons.forEach(btn => {
            btn.addEventListener('click', this.handleToolSelect);
        });
        
        // 植物按钮点击
        this.elements.plantButtons.forEach(btn => {
            btn.addEventListener('click', this.handlePlantSelect);
        });
        
        // 重试按钮
        if (this.elements.retryBtn) {
            this.elements.retryBtn.addEventListener('click', this.handleRetry);
        }
    }
    
    /**
     * 显示游戏内容
     */
    showGameContent() {
        this.elements.loadingScreen.style.display = 'none';
        this.elements.gameContent.style.display = 'flex';
        this.isLoading = false;
    }
    
    /**
     * 显示错误屏幕
     */
    showError() {
        this.elements.loadingScreen.style.display = 'none';
        this.elements.errorScreen.style.display = 'flex';
    }
    
    /**
     * 开始UI更新循环
     */
    startUIUpdateLoop() {
        // 每秒更新一次UI
        this.uiUpdateInterval = setInterval(this.updateUI, 1000);
        
        // 立即更新一次
        this.updateUI();
    }
    
    /**
     * 更新UI显示
     */
    updateUI() {
        if (!this.gameEngine) return;
        
        const gameState = this.gameEngine.getGameState();
        if (!gameState) return;
        
        const stats = gameState.getGameStats();
        const inputHandler = this.gameEngine.getInputHandler();
        const animationSystem = this.gameEngine.getAnimationSystem();
        
        // 检查积分变化
        const previousScore = this.previousScore || 0;
        if (stats.score > previousScore && this.elements.scoreDisplay) {
            // 播放积分增加动画
            if (animationSystem) {
                animationSystem.playUIFeedbackAnimation(this.elements.scoreDisplay, 'scoreIncrease', { 
                    amount: stats.score - previousScore 
                });
            }
        }
        this.previousScore = stats.score;
        
        // 检查等级变化
        const currentLevel = this.calculatePlayerLevel(stats.score);
        const previousLevel = this.previousLevel || 1;
        if (currentLevel > previousLevel && this.elements.levelDisplay) {
            // 播放等级提升动画
            if (animationSystem) {
                animationSystem.playUIFeedbackAnimation(this.elements.levelDisplay, 'levelUp', { 
                    newLevel: currentLevel 
                });
            }
        }
        this.previousLevel = currentLevel;
        
        // 更新积分显示
        if (this.elements.scoreDisplay) {
            this.elements.scoreDisplay.textContent = `积分: ${stats.score}`;
        }
        
        // 更新植物数量显示
        if (this.elements.plantsDisplay) {
            this.elements.plantsDisplay.textContent = `植物: ${stats.plantsInGarden}`;
        }
        
        // 更新收获数量显示
        if (this.elements.harvestDisplay) {
            this.elements.harvestDisplay.textContent = `收获: ${stats.plantsHarvested}`;
        }
        
        // 更新游戏时间显示
        if (this.elements.gameTimeDisplay) {
            const gameTime = this.formatGameTime(stats.gameTime);
            this.elements.gameTimeDisplay.textContent = `时间: ${gameTime}`;
            
            // 添加时间脉冲效果（每分钟）
            const totalSeconds = Math.floor(stats.gameTime / 1000);
            if (totalSeconds % 60 === 0 && totalSeconds > 0) {
                this.elements.gameTimeDisplay.classList.add('time-pulse');
                setTimeout(() => {
                    this.elements.gameTimeDisplay.classList.remove('time-pulse');
                }, 2000);
            }
        }
        
        // 更新等级信息显示
        if (this.elements.levelDisplay) {
            this.elements.levelDisplay.textContent = `等级: ${currentLevel}`;
        }
        
        // 更新当前工具显示
        if (this.elements.currentToolDisplay && inputHandler) {
            const toolNames = {
                'plant': '种植',
                'water': '浇水',
                'harvest': '收获'
            };
            const currentTool = inputHandler.getSelectedTool();
            this.elements.currentToolDisplay.textContent = `当前工具: ${toolNames[currentTool] || currentTool}`;
        }
        
        // 更新选择植物显示
        if (this.elements.selectedPlantDisplay && inputHandler) {
            const plantNames = {
                'flower': '花朵',
                'vegetable': '蔬菜',
                'tree': '树木'
            };
            const selectedPlant = inputHandler.getSelectedPlantType();
            this.elements.selectedPlantDisplay.textContent = `选择植物: ${plantNames[selectedPlant] || selectedPlant}`;
            
            // 只在种植工具选中时显示植物选择
            const currentTool = inputHandler.getSelectedTool();
            this.elements.selectedPlantDisplay.style.display = currentTool === 'plant' ? 'inline' : 'none';
        }
    }
    
    /**
     * 格式化游戏时间显示
     */
    formatGameTime(gameTimeMs) {
        const totalSeconds = Math.floor(gameTimeMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    /**
     * 计算玩家等级
     */
    calculatePlayerLevel(score) {
        // 简单的等级计算：每100分升一级
        return Math.floor(score / 100) + 1;
    }
    
    /**
     * 事件处理器 - 工具选择
     */
    handleToolSelect(event) {
        const tool = event.currentTarget.dataset.tool;
        const toolButton = event.currentTarget;
        
        // 更新按钮状态
        this.elements.toolButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });
        
        // 通知输入处理器
        const inputHandler = this.gameEngine?.getInputHandler();
        if (inputHandler) {
            inputHandler.setSelectedTool(tool);
        }
        
        // 播放工具选择动画
        const animationSystem = this.gameEngine?.getAnimationSystem();
        if (animationSystem) {
            animationSystem.playUIFeedbackAnimation(toolButton, 'toolSelect', { enhanced: true });
        }
        
        // 立即更新UI显示
        this.updateToolStatusDisplay(tool);
        
        console.log(`选择工具: ${tool}`);
    }
    
    /**
     * 事件处理器 - 植物选择
     */
    handlePlantSelect(event) {
        const plant = event.currentTarget.dataset.plant;
        const plantButton = event.currentTarget;
        
        // 更新按钮状态
        this.elements.plantButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.plant === plant);
        });
        
        // 通知输入处理器
        const inputHandler = this.gameEngine?.getInputHandler();
        if (inputHandler) {
            inputHandler.setSelectedPlantType(plant);
        }
        
        // 播放植物选择动画
        const animationSystem = this.gameEngine?.getAnimationSystem();
        if (animationSystem) {
            animationSystem.playUIFeedbackAnimation(plantButton, 'plantSelect');
        }
        
        // 立即更新UI显示
        this.updatePlantStatusDisplay(plant);
        
        console.log(`选择植物: ${plant}`);
    }
    
    /**
     * 更新工具状态显示
     */
    updateToolStatusDisplay(tool) {
        if (this.elements.currentToolDisplay) {
            const toolNames = {
                'plant': '种植',
                'water': '浇水',
                'harvest': '收获'
            };
            this.elements.currentToolDisplay.textContent = `当前工具: ${toolNames[tool] || tool}`;
        }
        
        // 根据工具选择显示/隐藏植物选择器
        if (this.elements.selectedPlantDisplay) {
            this.elements.selectedPlantDisplay.style.display = tool === 'plant' ? 'inline' : 'none';
        }
        
        // 更新植物选择器的可见性
        const plantSelector = document.getElementById('plant-selector');
        if (plantSelector) {
            plantSelector.style.display = tool === 'plant' ? 'flex' : 'none';
        }
    }
    
    /**
     * 更新植物状态显示
     */
    updatePlantStatusDisplay(plant) {
        if (this.elements.selectedPlantDisplay) {
            const plantNames = {
                'flower': '花朵',
                'vegetable': '蔬菜',
                'tree': '树木'
            };
            this.elements.selectedPlantDisplay.textContent = `选择植物: ${plantNames[plant] || plant}`;
        }
    }
    
    /**
     * 事件处理器 - 重试
     */
    handleRetry() {
        this.errorCount = 0;
        this.lastError = null;
        
        // 通知父页面重试开始
        this.sendMessageToParent('gameRetryStart', {
            timestamp: Date.now()
        });
        
        location.reload();
    }
    
    /**
     * 发送消息到父页面
     */
    sendMessageToParent(type, data = {}) {
        if (!this.isInIframe) return;
        
        try {
            const message = {
                type,
                data,
                source: 'growGardenGame',
                timestamp: Date.now()
            };
            
            window.parent.postMessage(message, this.parentOrigin);
            console.log(`发送消息到父页面: ${type}`, data);
        } catch (error) {
            console.error('发送消息到父页面失败:', error);
        }
    }
    
    /**
     * 处理来自父页面的消息
     */
    handleParentMessage(event) {
        // 在生产环境中应该验证origin
        // if (event.origin !== expectedOrigin) return;
        
        const { type, data } = event.data || {};
        
        if (!type || !data || data.source === 'growGardenGame') {
            return; // 忽略自己发送的消息
        }
        
        console.log(`收到父页面消息: ${type}`, data);
        
        const handler = this.messageHandlers.get(type);
        if (handler) {
            try {
                handler(data);
            } catch (error) {
                console.error(`处理父页面消息失败 (${type}):`, error);
                this.sendMessageToParent('messageHandlerError', {
                    messageType: type,
                    error: error.message,
                    timestamp: Date.now()
                });
            }
        } else {
            console.warn(`未知的消息类型: ${type}`);
        }
    }
    
    /**
     * 处理窗口错误
     */
    handleWindowError(event) {
        const error = {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack
        };
        
        console.error('窗口错误:', error);
        this.handleGameError(new Error(event.message), 'runtime', error);
    }
    
    /**
     * 处理未捕获的Promise拒绝
     */
    handleUnhandledRejection(event) {
        const error = {
            reason: event.reason,
            promise: event.promise
        };
        
        console.error('未处理的Promise拒绝:', error);
        this.handleGameError(event.reason, 'promise', error);
    }
    
    /**
     * 统一的游戏错误处理
     */
    handleGameError(error, context = 'unknown', details = {}) {
        this.errorCount++;
        this.lastError = {
            error: error.message || error,
            context,
            details,
            timestamp: Date.now(),
            count: this.errorCount
        };
        
        console.error(`游戏错误 (${context}):`, error, details);
        
        // 通知父页面发生错误
        this.sendMessageToParent('gameError', {
            error: error.message || error.toString(),
            context,
            details,
            errorCount: this.errorCount,
            canRetry: this.errorCount < this.maxRetries,
            timestamp: Date.now()
        });
        
        // 根据错误次数决定处理策略
        if (this.errorCount >= this.maxRetries) {
            // 达到最大重试次数，显示错误屏幕
            this.showError();
            this.sendMessageToParent('gameFailure', {
                error: '游戏多次失败，请刷新页面重试',
                finalError: this.lastError,
                timestamp: Date.now()
            });
        } else {
            // 尝试恢复
            this.attemptRecovery(context);
        }
    }
    
    /**
     * 尝试从错误中恢复
     */
    attemptRecovery(context) {
        console.log(`尝试从错误中恢复 (${context})...`);
        
        switch (context) {
            case 'initialization':
                // 初始化错误，显示错误屏幕
                this.showError();
                break;
                
            case 'runtime':
                // 运行时错误，尝试重启游戏引擎
                if (this.gameEngine) {
                    try {
                        this.gameEngine.restart();
                        this.sendMessageToParent('gameRecovered', {
                            context,
                            timestamp: Date.now()
                        });
                    } catch (restartError) {
                        console.error('重启游戏引擎失败:', restartError);
                        this.showError();
                    }
                }
                break;
                
            case 'promise':
                // Promise错误，记录但继续运行
                console.warn('Promise错误已记录，游戏继续运行');
                break;
                
            default:
                // 未知错误，显示错误屏幕
                this.showError();
        }
    }
    
    /**
     * 重置游戏
     */
    resetGame() {
        console.log('重置游戏...');
        
        try {
            if (this.gameEngine) {
                this.gameEngine.reset();
            }
            
            this.errorCount = 0;
            this.lastError = null;
            
            // 重置UI状态
            this.updateUI();
            
            this.sendMessageToParent('gameReset', {
                timestamp: Date.now(),
                success: true
            });
            
            console.log('游戏重置完成');
        } catch (error) {
            console.error('游戏重置失败:', error);
            this.handleGameError(error, 'reset');
        }
    }
    
    /**
     * 调整游戏尺寸
     */
    resizeGame(width, height) {
        console.log(`调整游戏尺寸: ${width}x${height}`);
        
        try {
            if (this.elements.canvas) {
                // 更新canvas尺寸
                this.elements.canvas.style.width = width + 'px';
                this.elements.canvas.style.height = height + 'px';
                
                // 通知游戏引擎尺寸变化
                if (this.gameEngine) {
                    this.gameEngine.handleResize(width, height);
                }
            }
            
            this.sendMessageToParent('gameResized', {
                width,
                height,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('调整游戏尺寸失败:', error);
            this.handleGameError(error, 'resize');
        }
    }
    
    /**
     * 获取游戏引擎实例
     */
    getGameEngine() {
        return this.gameEngine;
    }
    
    /**
     * 销毁游戏
     */
    destroy() {
        console.log('销毁游戏实例');
        
        // 停止UI更新循环
        if (this.uiUpdateInterval) {
            clearInterval(this.uiUpdateInterval);
            this.uiUpdateInterval = null;
        }
        
        // 销毁游戏引擎
        if (this.gameEngine) {
            this.gameEngine.destroy();
            this.gameEngine = null;
        }
        
        // 移除事件监听器
        this.elements.toolButtons.forEach(btn => {
            btn.removeEventListener('click', this.handleToolSelect);
        });
        
        this.elements.plantButtons.forEach(btn => {
            btn.removeEventListener('click', this.handlePlantSelect);
        });
        
        if (this.elements.retryBtn) {
            this.elements.retryBtn.removeEventListener('click', this.handleRetry);
        }
    }
    
    /**
     * 工具函数：延迟
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 游戏初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，开始初始化游戏');
    
    const game = new GrowGardenGame();
    game.init().catch(error => {
        console.error('游戏启动失败:', error);
    });
    
    // 将游戏实例暴露到全局，便于调试
    window.growGardenGame = game;
});