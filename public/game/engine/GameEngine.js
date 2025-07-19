/**
 * GameEngine - 游戏引擎核心类
 * 负责游戏的初始化、更新循环和渲染管道
 */

class GameEngine {
    constructor(canvasId, assetManager = null) {
        this.canvas = null;
        this.ctx = null;
        this.gameState = null;
        this.renderer = null;
        this.inputHandler = null;
        this.animationSystem = null;
        this.assetManager = assetManager;

        // 游戏循环相关
        this.isRunning = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.fps = 60;
        this.frameInterval = 1000 / this.fps;

        // 性能监控
        this.frameCount = 0;
        this.fpsDisplay = 0;
        this.lastFpsUpdate = 0;

        // Canvas ID
        this.canvasId = canvasId;

        // 绑定方法上下文
        this.gameLoop = this.gameLoop.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    /**
     * 初始化游戏引擎
     */
    async init() {
        try {
            console.log('初始化游戏引擎...');

            // 获取Canvas元素
            this.canvas = document.getElementById(this.canvasId);
            if (!this.canvas) {
                throw new Error(`Canvas元素未找到: ${this.canvasId}`);
            }

            // 获取2D渲染上下文
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) {
                throw new Error('无法获取Canvas 2D渲染上下文');
            }

            // 设置Canvas属性
            this.setupCanvas();

            // 初始化游戏状态管理器
            this.gameState = new GameState();
            await this.gameState.init();

            // 初始化渲染器
            this.renderer = new Renderer(this.canvas, this.ctx, this.assetManager);

            // 初始化动画系统
            this.animationSystem = new AnimationSystem();
            this.animationSystem.init();

            // 初始化输入处理器
            this.inputHandler = new InputHandler(this.canvas);
            this.inputHandler.setGameEngine(this);

            // 设置事件监听器
            this.setupEventListeners();

            console.log('游戏引擎初始化完成');
            return true;

        } catch (error) {
            console.error('游戏引擎初始化失败:', error);
            throw error;
        }
    }

    /**
     * 设置Canvas属性
     */
    setupCanvas() {
        // 设置Canvas尺寸
        this.resizeCanvas();

        // 设置渲染属性
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // 设置高DPI支持
        this.setupHighDPI();
    }

    /**
     * 设置高DPI支持
     */
    setupHighDPI() {
        const devicePixelRatio = window.devicePixelRatio || 1;
        const backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
            this.ctx.mozBackingStorePixelRatio ||
            this.ctx.msBackingStorePixelRatio ||
            this.ctx.oBackingStorePixelRatio ||
            this.ctx.backingStorePixelRatio || 1;

        const ratio = devicePixelRatio / backingStoreRatio;

        if (devicePixelRatio !== backingStoreRatio) {
            const oldWidth = this.canvas.width;
            const oldHeight = this.canvas.height;

            this.canvas.width = oldWidth * ratio;
            this.canvas.height = oldHeight * ratio;

            this.canvas.style.width = oldWidth + 'px';
            this.canvas.style.height = oldHeight + 'px';

            this.ctx.scale(ratio, ratio);
        }
    }

    /**
     * 调整Canvas尺寸
     */
    resizeCanvas() {
        const container = this.canvas.parentElement;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();

        // 计算合适的Canvas尺寸（保持16:9比例）
        const aspectRatio = 16 / 9;
        let canvasWidth = Math.min(containerRect.width - 40, 800);
        let canvasHeight = canvasWidth / aspectRatio;

        // 如果高度超出容器，则按高度调整
        if (canvasHeight > containerRect.height - 40) {
            canvasHeight = containerRect.height - 40;
            canvasWidth = canvasHeight * aspectRatio;
        }

        // 确保最小尺寸
        canvasWidth = Math.max(canvasWidth, 400);
        canvasHeight = Math.max(canvasHeight, 300);

        // 设置Canvas尺寸
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

        // 设置CSS尺寸
        this.canvas.style.width = canvasWidth + 'px';
        this.canvas.style.height = canvasHeight + 'px';

        console.log(`Canvas尺寸调整为: ${canvasWidth}x${canvasHeight}`);

        // 通知渲染器尺寸变化
        if (this.renderer) {
            this.renderer.onResize(canvasWidth, canvasHeight);
        }
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 窗口大小变化
        window.addEventListener('resize', this.handleResize);

        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }

    /**
     * 开始游戏循环
     */
    start() {
        if (this.isRunning) {
            console.warn('游戏循环已在运行');
            return;
        }

        console.log('开始游戏循环');
        this.isRunning = true;
        this.lastTime = performance.now();
        this.lastFpsUpdate = this.lastTime;

        // 启动游戏循环
        requestAnimationFrame(this.gameLoop);
    }

    /**
     * 停止游戏循环
     */
    stop() {
        console.log('停止游戏循环');
        this.isRunning = false;
    }

    /**
     * 暂停游戏
     */
    pause() {
        if (this.isRunning) {
            console.log('暂停游戏');
            this.isRunning = false;
        }
    }

    /**
     * 恢复游戏
     */
    resume() {
        if (!this.isRunning) {
            console.log('恢复游戏');
            this.isRunning = true;
            this.lastTime = performance.now();
            requestAnimationFrame(this.gameLoop);
        }
    }

    /**
     * 游戏主循环
     */
    gameLoop(currentTime) {
        if (!this.isRunning) return;

        // 计算时间差
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // 限制帧率
        if (this.deltaTime >= this.frameInterval) {
            // 更新游戏逻辑
            this.update(this.deltaTime);

            // 渲染游戏画面
            this.render();

            // 更新FPS计数
            this.updateFPS(currentTime);
        }

        // 继续循环
        requestAnimationFrame(this.gameLoop);
    }

    /**
     * 更新游戏逻辑
     */
    update(deltaTime) {
        if (!this.gameState) return;

        try {
            // 更新游戏状态
            this.gameState.update(deltaTime);

            // 处理输入
            if (this.inputHandler) {
                this.inputHandler.update(deltaTime);
            }

            // 清理过期动画
            if (this.animationSystem) {
                this.animationSystem.cleanup();
            }

        } catch (error) {
            console.error('游戏更新出错:', error);
        }
    }

    /**
     * 渲染游戏画面
     */
    render() {
        if (!this.renderer || !this.gameState) return;

        try {
            // 清空画布
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // 渲染游戏内容
            this.renderer.render(this.gameState);

            // 渲染调试信息（开发模式）
            if (this.isDebugMode()) {
                this.renderDebugInfo();
            }

        } catch (error) {
            console.error('游戏渲染出错:', error);
        }
    }

    /**
     * 更新FPS计数
     */
    updateFPS(currentTime) {
        this.frameCount++;

        if (currentTime - this.lastFpsUpdate >= 1000) {
            this.fpsDisplay = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
        }
    }

    /**
     * 渲染调试信息
     */
    renderDebugInfo() {
        const debugY = 20;
        const debugX = 10;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(debugX - 5, debugY - 15, 120, 60);

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';

        this.ctx.fillText(`FPS: ${this.fpsDisplay}`, debugX, debugY);
        this.ctx.fillText(`Delta: ${this.deltaTime.toFixed(2)}ms`, debugX, debugY + 15);
        this.ctx.fillText(`Canvas: ${this.canvas.width}x${this.canvas.height}`, debugX, debugY + 30);

        // 重置文本对齐
        this.ctx.textAlign = 'center';
    }

    /**
     * 检查是否为调试模式
     */
    isDebugMode() {
        return window.location.search.includes('debug=true') ||
            localStorage.getItem('gameDebug') === 'true';
    }

    /**
     * 获取游戏状态
     */
    getGameState() {
        return this.gameState;
    }

    /**
     * 获取渲染器
     */
    getRenderer() {
        return this.renderer;
    }

    /**
     * 获取输入处理器
     */
    getInputHandler() {
        return this.inputHandler;
    }

    /**
     * 获取动画系统
     */
    getAnimationSystem() {
        return this.animationSystem;
    }

    /**
     * 获取Canvas尺寸
     */
    getCanvasSize() {
        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    /**
     * 处理窗口大小变化
     */
    handleResize() {
        this.resizeCanvas();
    }

    /**
     * 重启游戏引擎
     */
    restart() {
        console.log('重启游戏引擎');

        try {
            // 停止当前游戏循环
            this.stop();

            // 重置游戏状态
            if (this.gameState) {
                this.gameState.reset();
            }

            // 清空画布
            if (this.ctx) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }

            // 重新开始游戏循环
            this.start();

            console.log('游戏引擎重启完成');
        } catch (error) {
            console.error('游戏引擎重启失败:', error);
            throw error;
        }
    }

    /**
     * 重置游戏
     */
    reset() {
        console.log('重置游戏');

        try {
            // 重置游戏状态
            if (this.gameState) {
                this.gameState.reset();
            }

            // 清空画布
            if (this.ctx) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }

            // 重置动画系统
            if (this.animationSystem) {
                this.animationSystem.reset();
            }

            console.log('游戏重置完成');
        } catch (error) {
            console.error('游戏重置失败:', error);
            throw error;
        }
    }

    /**
     * 处理iframe尺寸调整
     */
    handleResize(width, height) {
        console.log(`处理iframe尺寸调整: ${width}x${height}`);

        try {
            if (width && height) {
                // 更新Canvas容器尺寸
                const container = this.canvas.parentElement;
                if (container) {
                    container.style.width = width + 'px';
                    container.style.height = height + 'px';
                }
            }

            // 重新调整Canvas尺寸
            this.resizeCanvas();

        } catch (error) {
            console.error('处理iframe尺寸调整失败:', error);
        }
    }

    /**
     * 销毁游戏引擎
     */
    destroy() {
        console.log('销毁游戏引擎');

        // 停止游戏循环
        this.stop();

        // 移除事件监听器
        window.removeEventListener('resize', this.handleResize);

        // 销毁子系统
        if (this.inputHandler) {
            this.inputHandler.destroy();
        }

        if (this.animationSystem) {
            this.animationSystem.destroy();
        }

        if (this.gameState) {
            this.gameState.save();
        }

        // 清空引用
        this.canvas = null;
        this.ctx = null;
        this.gameState = null;
        this.renderer = null;
        this.inputHandler = null;
        this.animationSystem = null;
    }
}

// 导出类（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEngine;
}