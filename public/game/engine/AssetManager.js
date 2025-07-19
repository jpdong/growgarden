/**
 * 游戏资源管理器
 * 负责预加载和缓存游戏所需的图像资源
 */
class AssetManager {
    constructor() {
        this.assets = new Map();
        this.loadingPromises = new Map();
        this.loadedCount = 0;
        this.totalCount = 0;
        this.onProgress = null;
        this.onComplete = null;
        this.onError = null;
        
        // 资源配置 - 使用SVG格式
        this.assetConfig = {
            // 土壤和背景
            soil: {
                dry: 'assets/sprites/soil-dry.svg',
                wet: 'assets/sprites/soil-wet.svg',
                empty: 'assets/sprites/soil-empty.svg'
            },
            
            // 植物精灵 - 花朵
            flower: {
                seed: 'assets/sprites/flower-seed.svg',
                sprout: 'assets/sprites/flower-sprout.svg',
                young: 'assets/sprites/flower-young.svg',
                mature: 'assets/sprites/flower-mature.svg',
                ready: 'assets/sprites/flower-ready.svg'
            },
            
            // 植物精灵 - 蔬菜
            vegetable: {
                seed: 'assets/sprites/vegetable-seed.svg',
                sprout: 'assets/sprites/vegetable-sprout.svg',
                young: 'assets/sprites/vegetable-young.svg',
                mature: 'assets/sprites/vegetable-mature.svg',
                ready: 'assets/sprites/vegetable-ready.svg'
            },
            
            // 植物精灵 - 树木
            tree: {
                seed: 'assets/sprites/tree-seed.svg',
                sprout: 'assets/sprites/tree-sprout.svg',
                young: 'assets/sprites/tree-young.svg',
                mature: 'assets/sprites/tree-mature.svg',
                ready: 'assets/sprites/tree-ready.svg'
            },
            
            // 工具图标
            tools: {
                plant: 'assets/sprites/tool-plant.svg',
                water: 'assets/sprites/tool-water.svg',
                harvest: 'assets/sprites/tool-harvest.svg'
            },
            
            // 特效
            effects: {
                water: 'assets/sprites/effect-water.svg',
                sparkle: 'assets/sprites/effect-sparkle.svg',
                harvest: 'assets/sprites/effect-harvest.svg'
            },
            
            // UI元素
            ui: {
                background: 'assets/sprites/ui-background.svg',
                button: 'assets/sprites/ui-button.svg',
                panel: 'assets/sprites/ui-panel.svg'
            }
        };
    }
    
    /**
     * 开始加载所有资源
     * @returns {Promise} 加载完成的Promise
     */
    async loadAllAssets() {
        const allAssets = this._flattenAssetConfig(this.assetConfig);
        this.totalCount = allAssets.length;
        this.loadedCount = 0;
        
        console.log(`开始加载 ${this.totalCount} 个资源...`);
        
        try {
            const loadPromises = allAssets.map(({ key, path }) => 
                this._loadSingleAsset(key, path)
            );
            
            await Promise.all(loadPromises);
            
            console.log('所有资源加载完成');
            if (this.onComplete) {
                this.onComplete();
            }
            
            return true;
        } catch (error) {
            console.error('资源加载失败:', error);
            if (this.onError) {
                this.onError(error);
            }
            throw error;
        }
    }
    
    /**
     * 加载单个资源
     * @param {string} key 资源键名
     * @param {string} path 资源路径
     * @returns {Promise<HTMLImageElement>}
     */
    async _loadSingleAsset(key, path) {
        // 如果已经在加载中，返回现有的Promise
        if (this.loadingPromises.has(key)) {
            return this.loadingPromises.get(key);
        }
        
        // 如果已经加载完成，直接返回
        if (this.assets.has(key)) {
            return this.assets.get(key);
        }
        
        const loadPromise = new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                this.assets.set(key, img);
                this.loadedCount++;
                
                // 更新加载进度
                if (this.onProgress) {
                    this.onProgress(this.loadedCount, this.totalCount, key);
                }
                
                console.log(`资源加载完成: ${key} (${this.loadedCount}/${this.totalCount})`);
                resolve(img);
            };
            
            img.onerror = () => {
                console.warn(`资源加载失败: ${key} - ${path}`);
                
                // 创建占位符图像
                const placeholder = this._createPlaceholderImage(key);
                this.assets.set(key, placeholder);
                this.loadedCount++;
                
                if (this.onProgress) {
                    this.onProgress(this.loadedCount, this.totalCount, key);
                }
                
                resolve(placeholder);
            };
            
            // 设置跨域属性（如果需要）
            img.crossOrigin = 'anonymous';
            img.src = path;
        });
        
        this.loadingPromises.set(key, loadPromise);
        return loadPromise;
    }
    
    /**
     * 创建占位符图像
     * @param {string} key 资源键名
     * @returns {HTMLCanvasElement}
     */
    _createPlaceholderImage(key) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 64;
        canvas.height = 64;
        
        // 绘制占位符
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, 64, 64);
        
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(0, 0, 64, 64);
        
        // 绘制X标记
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(54, 54);
        ctx.moveTo(54, 10);
        ctx.lineTo(10, 54);
        ctx.stroke();
        
        // 添加文字
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Missing', 32, 30);
        ctx.fillText(key.split('.')[0], 32, 45);
        
        return canvas;
    }
    
    /**
     * 展平资源配置为数组
     * @param {Object} config 资源配置对象
     * @param {string} prefix 键名前缀
     * @returns {Array} 资源数组
     */
    _flattenAssetConfig(config, prefix = '') {
        const assets = [];
        
        for (const [key, value] of Object.entries(config)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            
            if (typeof value === 'string') {
                assets.push({ key: fullKey, path: value });
            } else if (typeof value === 'object') {
                assets.push(...this._flattenAssetConfig(value, fullKey));
            }
        }
        
        return assets;
    }
    
    /**
     * 获取资源
     * @param {string} key 资源键名
     * @returns {HTMLImageElement|HTMLCanvasElement|null}
     */
    getAsset(key) {
        return this.assets.get(key) || null;
    }
    
    /**
     * 检查资源是否已加载
     * @param {string} key 资源键名
     * @returns {boolean}
     */
    hasAsset(key) {
        return this.assets.has(key);
    }
    
    /**
     * 获取加载进度
     * @returns {Object} 包含已加载数量和总数量的对象
     */
    getProgress() {
        return {
            loaded: this.loadedCount,
            total: this.totalCount,
            percentage: this.totalCount > 0 ? (this.loadedCount / this.totalCount) * 100 : 0
        };
    }
    
    /**
     * 预加载特定资源组
     * @param {string} group 资源组名称
     * @returns {Promise}
     */
    async loadAssetGroup(group) {
        if (!this.assetConfig[group]) {
            throw new Error(`未找到资源组: ${group}`);
        }
        
        const groupAssets = this._flattenAssetConfig({ [group]: this.assetConfig[group] });
        const loadPromises = groupAssets.map(({ key, path }) => 
            this._loadSingleAsset(key, path)
        );
        
        return Promise.all(loadPromises);
    }
    
    /**
     * 清理资源缓存
     */
    clearCache() {
        this.assets.clear();
        this.loadingPromises.clear();
        this.loadedCount = 0;
        this.totalCount = 0;
    }
    
    /**
     * 设置事件监听器
     * @param {Function} onProgress 进度回调
     * @param {Function} onComplete 完成回调
     * @param {Function} onError 错误回调
     */
    setEventListeners(onProgress, onComplete, onError) {
        this.onProgress = onProgress;
        this.onComplete = onComplete;
        this.onError = onError;
    }
}

// 导出单例实例
window.AssetManager = AssetManager;