/**
 * 响应式管理器
 * 负责处理不同屏幕尺寸和设备的适配
 */
class ResponsiveManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.container = canvas.parentElement;
        
        // 设备信息
        this.deviceInfo = this.detectDevice();
        
        // 响应式配置
        this.breakpoints = {
            mobile: 480,
            tablet: 768,
            desktop: 1024
        };
        
        // 当前设备类型
        this.currentDeviceType = this.getCurrentDeviceType();
        
        // Canvas缩放信息
        this.scale = 1;
        this.actualWidth = 0;
        this.actualHeight = 0;
        this.displayWidth = 0;
        this.displayHeight = 0;
        
        // 高DPI支持
        this.pixelRatio = window.devicePixelRatio || 1;
        this.enableHighDPI = true;
        
        // 触摸优化
        this.touchOptimizations = {
            minTouchTarget: 44, // 最小触摸目标尺寸（像素）
            touchDelay: 300,    // 触摸延迟（毫秒）
            enableTouchFeedback: true
        };
        
        // 事件监听器
        this.resizeHandler = this.handleResize.bind(this);
        this.orientationHandler = this.handleOrientationChange.bind(this);
        
        // 初始化
        this.init();
    }
    
    /**
     * 检测设备信息
     */
    detectDevice() {
        const userAgent = navigator.userAgent;
        
        return {
            // 基本设备类型
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
            isTablet: /iPad|Android(?=.*Mobile)/i.test(userAgent),
            isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
            
            // 具体设备
            isIOS: /iPad|iPhone|iPod/.test(userAgent),
            isAndroid: /Android/.test(userAgent),
            
            // 屏幕信息
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            
            // 像素密度
            pixelRatio: window.devicePixelRatio || 1,
            
            // 触摸支持
            supportsTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            
            // 方向支持
            supportsOrientation: 'orientation' in window,
            currentOrientation: window.orientation || 0
        };
    }
    
    /**
     * 获取当前设备类型
     */
    getCurrentDeviceType() {
        const width = window.innerWidth;
        
        if (width <= this.breakpoints.mobile) {
            return 'mobile';
        } else if (width <= this.breakpoints.tablet) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }
    
    /**
     * 初始化响应式管理器
     */
    init() {
        console.log('初始化响应式管理器');
        console.log('设备信息:', this.deviceInfo);
        console.log('当前设备类型:', this.currentDeviceType);
        
        // 设置初始Canvas尺寸
        this.updateCanvasSize();
        
        // 设置高DPI支持
        if (this.enableHighDPI) {
            this.setupHighDPI();
        }
        
        // 添加事件监听器
        this.addEventListeners();
        
        // 应用设备特定优化
        this.applyDeviceOptimizations();
        
        return true;
    }
    
    /**
     * 更新Canvas尺寸
     */
    updateCanvasSize() {
        if (!this.container) return;
        
        const containerRect = this.container.getBoundingClientRect();
        const deviceType = this.getCurrentDeviceType();
        
        // 根据设备类型计算合适的尺寸
        let targetWidth, targetHeight;
        
        switch (deviceType) {
            case 'mobile':
                // 移动设备：使用更小的尺寸以提高性能
                targetWidth = Math.min(containerRect.width - 20, 400);
                targetHeight = targetWidth * 0.75; // 4:3比例
                break;
                
            case 'tablet':
                // 平板设备：中等尺寸
                targetWidth = Math.min(containerRect.width - 40, 600);
                targetHeight = targetWidth * 0.6; // 5:3比例
                break;
                
            case 'desktop':
            default:
                // 桌面设备：较大尺寸
                targetWidth = Math.min(containerRect.width - 40, 800);
                targetHeight = targetWidth * 0.5625; // 16:9比例
                break;
        }
        
        // 确保不超出容器高度
        const maxHeight = containerRect.height - 40;
        if (targetHeight > maxHeight) {
            targetHeight = maxHeight;
            targetWidth = targetHeight / 0.5625; // 保持比例
        }
        
        // 设置最小尺寸
        targetWidth = Math.max(targetWidth, 300);
        targetHeight = Math.max(targetHeight, 200);
        
        // 更新Canvas尺寸
        this.displayWidth = targetWidth;
        this.displayHeight = targetHeight;
        
        // 应用尺寸
        this.applyCanvasSize();
        
        console.log(`Canvas尺寸更新为: ${this.displayWidth}x${this.displayHeight} (${deviceType})`);
    }
    
    /**
     * 应用Canvas尺寸
     */
    applyCanvasSize() {
        // 设置显示尺寸
        this.canvas.style.width = this.displayWidth + 'px';
        this.canvas.style.height = this.displayHeight + 'px';
        
        // 设置实际尺寸（考虑像素密度）
        if (this.enableHighDPI) {
            this.actualWidth = this.displayWidth * this.pixelRatio;
            this.actualHeight = this.displayHeight * this.pixelRatio;
        } else {
            this.actualWidth = this.displayWidth;
            this.actualHeight = this.displayHeight;
        }
        
        this.canvas.width = this.actualWidth;
        this.canvas.height = this.actualHeight;
        
        // 更新缩放比例
        this.scale = this.actualWidth / this.displayWidth;
    }
    
    /**
     * 设置高DPI支持
     */
    setupHighDPI() {
        if (this.pixelRatio <= 1) return;
        
        const ctx = this.canvas.getContext('2d');
        if (!ctx) return;
        
        // 缩放上下文以匹配设备像素比
        ctx.scale(this.pixelRatio, this.pixelRatio);
        
        // 设置图像渲染质量
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        console.log(`高DPI支持已启用，像素比: ${this.pixelRatio}`);
    }
    
    /**
     * 添加事件监听器
     */
    addEventListeners() {
        // 窗口大小变化
        window.addEventListener('resize', this.resizeHandler);
        
        // 设备方向变化
        if (this.deviceInfo.supportsOrientation) {
            window.addEventListener('orientationchange', this.orientationHandler);
        }
        
        // 视口变化（移动设备）
        if (this.deviceInfo.isMobile) {
            window.addEventListener('scroll', this.handleViewportChange.bind(this));
        }
    }
    
    /**
     * 移除事件监听器
     */
    removeEventListeners() {
        window.removeEventListener('resize', this.resizeHandler);
        window.removeEventListener('orientationchange', this.orientationHandler);
        window.removeEventListener('scroll', this.handleViewportChange.bind(this));
    }
    
    /**
     * 处理窗口大小变化
     */
    handleResize() {
        // 防抖处理
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            const newDeviceType = this.getCurrentDeviceType();
            
            // 如果设备类型发生变化，重新应用优化
            if (newDeviceType !== this.currentDeviceType) {
                this.currentDeviceType = newDeviceType;
                this.applyDeviceOptimizations();
            }
            
            // 更新Canvas尺寸
            this.updateCanvasSize();
            
            // 触发自定义事件
            this.dispatchResizeEvent();
            
        }, 100);
    }
    
    /**
     * 处理设备方向变化
     */
    handleOrientationChange() {
        // 延迟处理，等待方向变化完成
        setTimeout(() => {
            this.deviceInfo.currentOrientation = window.orientation || 0;
            this.handleResize();
            
            console.log('设备方向已变化:', this.deviceInfo.currentOrientation);
        }, 500);
    }
    
    /**
     * 处理视口变化
     */
    handleViewportChange() {
        // 移动设备上的地址栏显示/隐藏可能影响视口
        if (this.deviceInfo.isMobile) {
            this.handleResize();
        }
    }
    
    /**
     * 应用设备特定优化
     */
    applyDeviceOptimizations() {
        const deviceType = this.currentDeviceType;
        
        // 移动设备优化
        if (deviceType === 'mobile') {
            this.applyMobileOptimizations();
        }
        // 平板设备优化
        else if (deviceType === 'tablet') {
            this.applyTabletOptimizations();
        }
        // 桌面设备优化
        else {
            this.applyDesktopOptimizations();
        }
        
        // 触摸设备优化
        if (this.deviceInfo.supportsTouch) {
            this.applyTouchOptimizations();
        }
    }
    
    /**
     * 应用移动设备优化
     */
    applyMobileOptimizations() {
        // 禁用某些高性能特性
        document.body.classList.add('mobile-device');
        
        // 设置视口元标签（如果不存在）
        this.ensureViewportMeta();
        
        // 禁用双击缩放
        this.disableDoubleTapZoom();
        
        console.log('已应用移动设备优化');
    }
    
    /**
     * 应用平板设备优化
     */
    applyTabletOptimizations() {
        document.body.classList.add('tablet-device');
        console.log('已应用平板设备优化');
    }
    
    /**
     * 应用桌面设备优化
     */
    applyDesktopOptimizations() {
        document.body.classList.add('desktop-device');
        console.log('已应用桌面设备优化');
    }
    
    /**
     * 应用触摸优化
     */
    applyTouchOptimizations() {
        // 增加触摸目标尺寸
        document.body.classList.add('touch-device');
        
        // 添加触摸反馈样式
        if (this.touchOptimizations.enableTouchFeedback) {
            this.addTouchFeedbackStyles();
        }
        
        // 优化触摸事件
        this.optimizeTouchEvents();
        
        console.log('已应用触摸优化');
    }
    
    /**
     * 确保视口元标签存在
     */
    ensureViewportMeta() {
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        
        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            document.head.appendChild(viewportMeta);
        }
        
        // 设置适合游戏的视口配置
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    }
    
    /**
     * 禁用双击缩放
     */
    disableDoubleTapZoom() {
        // 添加CSS样式禁用双击缩放
        const style = document.createElement('style');
        style.textContent = `
            * {
                touch-action: manipulation;
            }
            
            canvas {
                touch-action: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * 添加触摸反馈样式
     */
    addTouchFeedbackStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .touch-device .tool-btn:active,
            .touch-device .plant-btn:active {
                transform: scale(0.95);
                transition: transform 0.1s ease;
            }
            
            .touch-device .tool-btn,
            .touch-device .plant-btn {
                min-height: ${this.touchOptimizations.minTouchTarget}px;
                min-width: ${this.touchOptimizations.minTouchTarget}px;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * 优化触摸事件
     */
    optimizeTouchEvents() {
        // 防止触摸时的默认行为
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
        }, { passive: false });
    }
    
    /**
     * 触发自定义调整大小事件
     */
    dispatchResizeEvent() {
        const event = new CustomEvent('canvasResize', {
            detail: {
                width: this.actualWidth,
                height: this.actualHeight,
                displayWidth: this.displayWidth,
                displayHeight: this.displayHeight,
                scale: this.scale,
                deviceType: this.currentDeviceType
            }
        });
        
        window.dispatchEvent(event);
    }
    
    /**
     * 将屏幕坐标转换为Canvas坐标
     */
    screenToCanvas(screenX, screenY) {
        const rect = this.canvas.getBoundingClientRect();
        
        return {
            x: (screenX - rect.left) * this.scale,
            y: (screenY - rect.top) * this.scale
        };
    }
    
    /**
     * 将Canvas坐标转换为屏幕坐标
     */
    canvasToScreen(canvasX, canvasY) {
        const rect = this.canvas.getBoundingClientRect();
        
        return {
            x: (canvasX / this.scale) + rect.left,
            y: (canvasY / this.scale) + rect.top
        };
    }
    
    /**
     * 获取当前设备信息
     */
    getDeviceInfo() {
        return {
            ...this.deviceInfo,
            currentDeviceType: this.currentDeviceType,
            canvasScale: this.scale,
            displaySize: {
                width: this.displayWidth,
                height: this.displayHeight
            },
            actualSize: {
                width: this.actualWidth,
                height: this.actualHeight
            }
        };
    }
    
    /**
     * 获取触摸优化配置
     */
    getTouchOptimizations() {
        return this.touchOptimizations;
    }
    
    /**
     * 设置触摸优化配置
     */
    setTouchOptimizations(options) {
        this.touchOptimizations = { ...this.touchOptimizations, ...options };
        
        if (this.deviceInfo.supportsTouch) {
            this.applyTouchOptimizations();
        }
    }
    
    /**
     * 检查是否为移动设备
     */
    isMobileDevice() {
        return this.currentDeviceType === 'mobile';
    }
    
    /**
     * 检查是否为触摸设备
     */
    isTouchDevice() {
        return this.deviceInfo.supportsTouch;
    }
    
    /**
     * 获取Canvas缩放比例
     */
    getScale() {
        return this.scale;
    }
    
    /**
     * 销毁响应式管理器
     */
    destroy() {
        console.log('销毁响应式管理器');
        
        // 移除事件监听器
        this.removeEventListeners();
        
        // 清理定时器
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        // 移除设备类样式
        document.body.classList.remove('mobile-device', 'tablet-device', 'desktop-device', 'touch-device');
    }
}

// 导出类
window.ResponsiveManager = ResponsiveManager;