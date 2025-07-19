/**
 * 性能管理器
 * 负责游戏性能优化和监控
 */
class PerformanceManager {
    constructor() {
        // 性能监控
        this.frameCount = 0;
        this.fps = 0;
        this.lastFpsUpdate = 0;
        this.frameTime = 0;
        this.lastFrameTime = 0;
        
        // 性能阈值
        this.targetFPS = 60;
        this.minFPS = 30;
        this.maxFrameTime = 1000 / this.minFPS;
        
        // 优化标志
        this.isLowPerformance = false;
        this.adaptiveQuality = true;
        this.currentQualityLevel = 'high'; // high, medium, low
        
        // 脏矩形系统
        this.dirtyRects = [];
        this.enableDirtyRectOptimization = true;
        
        // 渲染优化
        this.skipFrames = 0;
        this.maxSkipFrames = 2;
        
        // 设备信息
        this.deviceInfo = this.detectDeviceCapabilities();
        
        // 性能统计
        this.stats = {
            totalFrames: 0,
            droppedFrames: 0,
            averageFPS: 0,
            minFPS: Infinity,
            maxFPS: 0,
            memoryUsage: 0
        };
        
        // 绑定方法
        this.updatePerformanceStats = this.updatePerformanceStats.bind(this);
    }
    
    /**
     * 检测设备性能能力
     */
    detectDeviceCapabilities() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        return {
            // 设备像素比
            devicePixelRatio: window.devicePixelRatio || 1,
            
            // 屏幕信息
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            
            // 是否为移动设备
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            
            // 是否为触摸设备
            isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            
            // 内存信息（如果可用）
            memory: navigator.deviceMemory || 'unknown',
            
            // 硬件并发数
            hardwareConcurrency: navigator.hardwareConcurrency || 1,
            
            // Canvas支持
            canvasSupport: !!ctx,
            
            // 高DPI支持
            supportsHighDPI: window.devicePixelRatio > 1
        };
    }
    
    /**
     * 初始化性能管理器
     */
    init() {
        console.log('初始化性能管理器');
        console.log('设备信息:', this.deviceInfo);
        
        // 根据设备能力设置初始质量级别
        this.setInitialQualityLevel();
        
        // 开始性能监控
        this.startPerformanceMonitoring();
        
        return true;
    }
    
    /**
     * 设置初始质量级别
     */
    setInitialQualityLevel() {
        if (this.deviceInfo.isMobile || this.deviceInfo.memory < 4) {
            this.currentQualityLevel = 'medium';
        } else if (this.deviceInfo.memory < 2) {
            this.currentQualityLevel = 'low';
        } else {
            this.currentQualityLevel = 'high';
        }
        
        console.log(`初始质量级别设置为: ${this.currentQualityLevel}`);
    }
    
    /**
     * 开始性能监控
     */
    startPerformanceMonitoring() {
        // 每秒更新一次性能统计
        setInterval(this.updatePerformanceStats, 1000);
        
        // 监听内存压力事件（如果支持）
        if ('memory' in performance) {
            this.monitorMemoryUsage();
        }
    }
    
    /**
     * 更新性能统计
     */
    updatePerformanceStats() {
        // 计算平均FPS
        if (this.stats.totalFrames > 0) {
            this.stats.averageFPS = this.stats.totalFrames / (performance.now() / 1000);
        }
        
        // 检查是否需要调整质量
        if (this.adaptiveQuality) {
            this.adjustQualityBasedOnPerformance();
        }
        
        // 更新内存使用情况
        if (performance.memory) {
            this.stats.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
        }
    }
    
    /**
     * 监控内存使用
     */
    monitorMemoryUsage() {
        if (!performance.memory) return;
        
        const checkMemory = () => {
            const memoryInfo = performance.memory;
            const usedMB = memoryInfo.usedJSHeapSize / 1024 / 1024;
            const limitMB = memoryInfo.jsHeapSizeLimit / 1024 / 1024;
            
            // 如果内存使用超过80%，降低质量
            if (usedMB / limitMB > 0.8 && this.currentQualityLevel !== 'low') {
                console.warn('内存使用过高，降低渲染质量');
                this.lowerQuality();
            }
        };
        
        setInterval(checkMemory, 5000); // 每5秒检查一次
    }
    
    /**
     * 记录帧性能
     */
    recordFrame(deltaTime) {
        this.frameCount++;
        this.stats.totalFrames++;
        this.frameTime = deltaTime;
        
        // 更新FPS
        const now = performance.now();
        if (now - this.lastFpsUpdate >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = now;
            
            // 更新统计
            this.stats.minFPS = Math.min(this.stats.minFPS, this.fps);
            this.stats.maxFPS = Math.max(this.stats.maxFPS, this.fps);
        }
        
        // 检查是否为低性能
        this.isLowPerformance = this.fps < this.minFPS || deltaTime > this.maxFrameTime;
        
        // 记录丢帧
        if (deltaTime > this.maxFrameTime) {
            this.stats.droppedFrames++;
        }
        
        this.lastFrameTime = now;
    }
    
    /**
     * 根据性能调整质量
     */
    adjustQualityBasedOnPerformance() {
        const avgFPS = this.fps;
        
        // 如果FPS过低，降低质量
        if (avgFPS < this.minFPS && this.currentQualityLevel !== 'low') {
            this.lowerQuality();
        }
        // 如果FPS很高，可以提高质量
        else if (avgFPS > this.targetFPS * 0.9 && this.currentQualityLevel !== 'high') {
            this.raiseQuality();
        }
    }
    
    /**
     * 降低渲染质量
     */
    lowerQuality() {
        switch (this.currentQualityLevel) {
            case 'high':
                this.currentQualityLevel = 'medium';
                break;
            case 'medium':
                this.currentQualityLevel = 'low';
                break;
        }
        
        console.log(`降低渲染质量至: ${this.currentQualityLevel}`);
        this.applyQualitySettings();
    }
    
    /**
     * 提高渲染质量
     */
    raiseQuality() {
        switch (this.currentQualityLevel) {
            case 'low':
                this.currentQualityLevel = 'medium';
                break;
            case 'medium':
                this.currentQualityLevel = 'high';
                break;
        }
        
        console.log(`提高渲染质量至: ${this.currentQualityLevel}`);
        this.applyQualitySettings();
    }
    
    /**
     * 应用质量设置
     */
    applyQualitySettings() {
        const settings = this.getQualitySettings(this.currentQualityLevel);
        
        // 触发质量变更事件
        window.dispatchEvent(new CustomEvent('qualityChanged', {
            detail: {
                level: this.currentQualityLevel,
                settings: settings
            }
        }));
    }
    
    /**
     * 获取质量设置
     */
    getQualitySettings(level) {
        const settings = {
            high: {
                enableParticles: true,
                enableAnimations: true,
                enableShadows: true,
                particleCount: 100,
                animationFrameRate: 60,
                textureQuality: 1.0,
                enableAntialiasing: true
            },
            medium: {
                enableParticles: true,
                enableAnimations: true,
                enableShadows: false,
                particleCount: 50,
                animationFrameRate: 30,
                textureQuality: 0.8,
                enableAntialiasing: false
            },
            low: {
                enableParticles: false,
                enableAnimations: false,
                enableShadows: false,
                particleCount: 0,
                animationFrameRate: 15,
                textureQuality: 0.6,
                enableAntialiasing: false
            }
        };
        
        return settings[level] || settings.medium;
    }
    
    /**
     * 添加脏矩形
     */
    addDirtyRect(x, y, width, height) {
        if (!this.enableDirtyRectOptimization) return;
        
        this.dirtyRects.push({
            x: Math.floor(x),
            y: Math.floor(y),
            width: Math.ceil(width),
            height: Math.ceil(height)
        });
    }
    
    /**
     * 获取合并的脏矩形
     */
    getMergedDirtyRects() {
        if (!this.enableDirtyRectOptimization || this.dirtyRects.length === 0) {
            return null;
        }
        
        // 简单合并：如果脏矩形太多，直接重绘整个画面
        if (this.dirtyRects.length > 10) {
            return null;
        }
        
        return this.dirtyRects.slice();
    }
    
    /**
     * 清空脏矩形
     */
    clearDirtyRects() {
        this.dirtyRects = [];
    }
    
    /**
     * 检查是否应该跳过帧
     */
    shouldSkipFrame() {
        if (!this.isLowPerformance) {
            this.skipFrames = 0;
            return false;
        }
        
        if (this.skipFrames < this.maxSkipFrames) {
            this.skipFrames++;
            return true;
        }
        
        this.skipFrames = 0;
        return false;
    }
    
    /**
     * 获取当前FPS
     */
    getFPS() {
        return this.fps;
    }
    
    /**
     * 获取性能统计
     */
    getStats() {
        return {
            ...this.stats,
            currentFPS: this.fps,
            frameTime: this.frameTime,
            qualityLevel: this.currentQualityLevel,
            isLowPerformance: this.isLowPerformance
        };
    }
    
    /**
     * 获取设备信息
     */
    getDeviceInfo() {
        return this.deviceInfo;
    }
    
    /**
     * 设置自适应质量开关
     */
    setAdaptiveQuality(enabled) {
        this.adaptiveQuality = enabled;
        console.log(`自适应质量${enabled ? '开启' : '关闭'}`);
    }
    
    /**
     * 手动设置质量级别
     */
    setQualityLevel(level) {
        if (['low', 'medium', 'high'].includes(level)) {
            this.currentQualityLevel = level;
            this.applyQualitySettings();
            console.log(`手动设置质量级别为: ${level}`);
        }
    }
    
    /**
     * 重置性能统计
     */
    resetStats() {
        this.stats = {
            totalFrames: 0,
            droppedFrames: 0,
            averageFPS: 0,
            minFPS: Infinity,
            maxFPS: 0,
            memoryUsage: 0
        };
        
        console.log('性能统计已重置');
    }
    
    /**
     * 销毁性能管理器
     */
    destroy() {
        console.log('销毁性能管理器');
        
        // 清理定时器和事件监听器
        // 注意：实际项目中应该保存定时器ID并清理
    }
}

// 导出类
window.PerformanceManager = PerformanceManager;