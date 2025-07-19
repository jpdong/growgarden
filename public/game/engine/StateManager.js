/**
 * GameState - 游戏状态管理类
 * 负责游戏状态的管理、保存和加载
 */

class GameState {
    constructor() {
        // 游戏基础数据
        this.gameTime = 0;
        this.lastSaveTime = Date.now();
        this.isInitialized = false;
        
        // 玩家数据
        this.player = {
            score: 0,
            plantsHarvested: 0,
            totalPlayTime: 0,
            achievements: []
        };
        
        // 花园数据 - 使用GardenGrid类
        this.garden = null;
        
        // 游戏配置
        this.config = {
            gridSize: { width: 8, height: 8 },
            cellSize: 64,
            plantGrowthTimes: {
                flower: [30000, 60000, 120000, 180000], // 30s, 1m, 2m, 3m
                vegetable: [45000, 90000, 180000, 270000], // 45s, 1.5m, 3m, 4.5m
                tree: [60000, 180000, 360000, 540000] // 1m, 3m, 6m, 9m
            },
            wateringInterval: 120000, // 2分钟
            harvestRewards: {
                flower: 10,
                vegetable: 15,
                tree: 25
            }
        };
        
        // 存储键名
        this.storageKey = 'growGardenGameState';
        this.configKey = 'growGardenGameConfig';
        
        // 自动保存间隔（30秒）
        this.autoSaveInterval = 30000;
        this.lastAutoSave = Date.now();
    }
    
    /**
     * 初始化游戏状态
     */
    async init() {
        try {
            console.log('初始化游戏状态管理器...');
            
            // 初始化花园网格
            this.initializeGarden();
            
            // 尝试加载保存的状态
            const loaded = this.load();
            
            if (loaded) {
                console.log('成功加载保存的游戏状态');
                // 处理离线时间
                this.handleOfflineTime();
            } else {
                console.log('创建新的游戏状态');
                // 保存初始状态
                this.save();
            }
            
            this.isInitialized = true;
            console.log('游戏状态管理器初始化完成');
            
        } catch (error) {
            console.error('游戏状态初始化失败:', error);
            // 创建默认状态
            this.reset();
            this.isInitialized = true;
        }
    }
    
    /**
     * 初始化花园网格
     */
    initializeGarden() {
        // 创建GardenGrid实例
        this.garden = new GardenGrid(
            this.config.gridSize.width,
            this.config.gridSize.height,
            this.config.cellSize
        );
        
        console.log(`初始化 ${this.garden.width}x${this.garden.height} 花园网格`);
    }
    
    /**
     * 创建空的土壤格子
     */
    createEmptyCell() {
        return {
            plant: null,
            soilMoisture: 0.5, // 土壤湿度 (0-1)
            lastWatered: 0,
            fertility: 1.0 // 土壤肥力 (0-1)
        };
    }
    
    /**
     * 更新游戏状态
     */
    update(deltaTime) {
        if (!this.isInitialized) return;
        
        // 更新游戏时间
        this.gameTime += deltaTime;
        this.player.totalPlayTime += deltaTime;
        
        // 更新花园状态
        this.updateGarden(deltaTime);
        
        // 自动保存检查
        const now = Date.now();
        if (now - this.lastAutoSave >= this.autoSaveInterval) {
            this.save();
            this.lastAutoSave = now;
        }
    }
    
    /**
     * 更新花园状态
     */
    updateGarden(deltaTime) {
        if (!this.garden) return;
        
        // 使用GardenGrid的update方法，它会自动调用每个植物的update方法
        this.garden.update(deltaTime);
    }
    
    /**
     * 更新土壤湿度
     */
    updateSoilMoisture(cell, deltaTime) {
        // 土壤湿度随时间自然蒸发
        const evaporationRate = 0.00001; // 每毫秒蒸发率
        cell.soilMoisture = Math.max(0, cell.soilMoisture - evaporationRate * deltaTime);
    }
    
    /**
     * 更新植物状态
     */
    updatePlant(plant, cell, deltaTime, currentTime) {
        // 检查植物是否需要升级成长阶段
        const timeSincePlanted = currentTime - plant.plantedTime;
        const growthTimes = this.config.plantGrowthTimes[plant.type];
        
        // 计算当前应该的成长阶段
        let targetStage = 0;
        for (let i = 0; i < growthTimes.length; i++) {
            if (timeSincePlanted >= growthTimes[i]) {
                targetStage = i + 1;
            } else {
                break;
            }
        }
        
        // 更新成长阶段
        if (targetStage > plant.stage && targetStage <= 4) {
            plant.stage = targetStage;
            console.log(`植物 ${plant.id} 成长到阶段 ${plant.stage}`);
        }
        
        // 更新植物健康状态
        this.updatePlantHealth(plant, cell, currentTime);
    }
    
    /**
     * 更新植物健康状态
     */
    updatePlantHealth(plant, cell, currentTime) {
        // 检查是否需要浇水
        const timeSinceWatered = currentTime - plant.lastWatered;
        const needsWater = timeSinceWatered > this.config.wateringInterval;
        
        if (needsWater && cell.soilMoisture < 0.3) {
            // 植物缺水，健康度下降
            plant.health = Math.max(0, plant.health - 0.001);
        } else if (cell.soilMoisture > 0.7) {
            // 土壤湿润，健康度恢复
            plant.health = Math.min(1, plant.health + 0.002);
        }
    }
    
    /**
     * 种植植物
     */
    plantSeed(x, y, plantType) {
        if (!this.garden || !this.garden.isValidCoordinate(x, y)) {
            console.warn(`无效坐标: (${x}, ${y})`);
            return false;
        }
        
        const cell = this.garden.getCell(x, y);
        if (!cell) {
            console.warn(`无法获取格子: (${x}, ${y})`);
            return false;
        }
        
        if (cell.plant) {
            console.warn(`位置 (${x}, ${y}) 已有植物`);
            return false;
        }
        
        // 使用Plant类创建新植物
        try {
            const plant = Plant.createPlant(plantType);
            cell.plant = plant;
            cell.isEmpty = false;
            console.log(`在 (${x}, ${y}) 种植了 ${plantType}，植物ID: ${plant.id}`);
            
            // 自动保存
            this.save();
            return true;
        } catch (error) {
            console.error(`创建植物失败: ${error.message}`);
            return false;
        }
    }
    
    /**
     * 浇水
     */
    waterPlant(x, y) {
        if (!this.garden || !this.garden.isValidCoordinate(x, y)) {
            console.warn(`无效坐标: (${x}, ${y})`);
            return false;
        }
        
        // 使用GardenGrid的waterAt方法
        const success = this.garden.waterAt(x, y);
        
        if (success) {
            const cell = this.garden.getCell(x, y);
            if (cell && cell.plant) {
                console.log(`为植物 ${cell.plant.id} 浇水`);
            } else {
                console.log(`为土壤 (${x}, ${y}) 浇水`);
            }
            
            // 自动保存
            this.save();
        }
        
        return success;
    }
    
    /**
     * 收获植物
     */
    harvestPlant(x, y) {
        if (!this.garden || !this.garden.isValidCoordinate(x, y)) {
            console.warn(`无效坐标: (${x}, ${y})`);
            return false;
        }
        
        // 使用GardenGrid的harvestAt方法
        const result = this.garden.harvestAt(x, y);
        
        if (result) {
            // 获取植物的收获奖励
            const reward = result.getHarvestReward();
            
            // 更新玩家数据
            this.player.score += reward;
            this.player.plantsHarvested++;
            
            console.log(`收获植物 ${result.id}，获得 ${reward} 积分`);
            
            // 自动保存
            this.save();
            return { reward: reward, plant: result };
        }
        
        return false;
    }
    
    /**
     * 检查坐标是否有效
     */
    isValidCoordinate(x, y) {
        return x >= 0 && x < this.garden.width && y >= 0 && y < this.garden.height;
    }
    
    /**
     * 生成植物ID
     */
    generatePlantId() {
        return 'plant_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * 处理离线时间
     */
    handleOfflineTime() {
        const currentTime = Date.now();
        const offlineTime = currentTime - this.lastSaveTime;
        
        if (offlineTime > 60000) { // 离线超过1分钟
            console.log(`处理离线时间: ${Math.floor(offlineTime / 1000)} 秒`);
            
            // 模拟离线期间的植物成长
            this.simulateOfflineGrowth(offlineTime);
        }
    }
    
    /**
     * 模拟离线成长
     */
    simulateOfflineGrowth(offlineTime) {
        const currentTime = Date.now();
        
        for (let y = 0; y < this.garden.height; y++) {
            for (let x = 0; x < this.garden.width; x++) {
                const cell = this.garden.cells[y][x];
                
                if (cell.plant) {
                    // 更新植物成长阶段
                    this.updatePlant(cell.plant, cell, offlineTime, currentTime);
                    
                    // 模拟土壤湿度变化
                    const evaporation = 0.00001 * offlineTime;
                    cell.soilMoisture = Math.max(0, cell.soilMoisture - evaporation);
                }
            }
        }
    }
    
    /**
     * 保存游戏状态到localStorage
     */
    save() {
        try {
            const stateData = {
                gameTime: this.gameTime,
                lastSaveTime: Date.now(),
                player: this.player,
                garden: this.garden,
                version: '1.0.0'
            };
            
            const serializedData = JSON.stringify(stateData);
            localStorage.setItem(this.storageKey, serializedData);
            
            // 保存配置
            localStorage.setItem(this.configKey, JSON.stringify(this.config));
            
            console.log('游戏状态已保存');
            return true;
            
        } catch (error) {
            console.error('保存游戏状态失败:', error);
            return false;
        }
    }
    
    /**
     * 从localStorage加载游戏状态
     */
    load() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            
            if (!savedData) {
                console.log('没有找到保存的游戏状态');
                return null;
            }
            
            const stateData = JSON.parse(savedData);
            
            // 验证数据版本和完整性
            if (!this.validateStateData(stateData)) {
                console.warn('保存的游戏状态数据无效');
                return null;
            }
            
            // 恢复状态
            this.gameTime = stateData.gameTime || 0;
            this.lastSaveTime = stateData.lastSaveTime || Date.now();
            this.player = { ...this.player, ...stateData.player };
            
            // 恢复花园状态
            if (stateData.garden && stateData.garden.cells) {
                this.garden = stateData.garden;
            }
            
            // 加载配置
            this.loadConfig();
            
            console.log('游戏状态加载完成');
            return stateData;
            
        } catch (error) {
            console.error('加载游戏状态失败:', error);
            return null;
        }
    }
    
    /**
     * 加载配置
     */
    loadConfig() {
        try {
            const savedConfig = localStorage.getItem(this.configKey);
            if (savedConfig) {
                const configData = JSON.parse(savedConfig);
                this.config = { ...this.config, ...configData };
            }
        } catch (error) {
            console.warn('加载配置失败，使用默认配置:', error);
        }
    }
    
    /**
     * 验证状态数据
     */
    validateStateData(data) {
        if (!data || typeof data !== 'object') {
            return false;
        }
        
        // 检查必要字段
        if (!data.player || !data.garden) {
            return false;
        }
        
        // 检查花园数据结构
        if (!Array.isArray(data.garden.cells)) {
            return false;
        }
        
        return true;
    }
    
    /**
     * 重置游戏状态
     */
    reset() {
        console.log('重置游戏状态');
        
        // 重置玩家数据
        this.player = {
            score: 0,
            plantsHarvested: 0,
            totalPlayTime: 0,
            achievements: []
        };
        
        // 重置游戏时间
        this.gameTime = 0;
        this.lastSaveTime = Date.now();
        
        // 重新初始化花园
        this.initializeGarden();
        
        // 保存重置后的状态
        this.save();
    }
    
    /**
     * 获取游戏统计信息
     */
    getGameStats() {
        return {
            score: this.player.score,
            plantsHarvested: this.player.plantsHarvested,
            totalPlayTime: this.player.totalPlayTime,
            gameTime: this.gameTime,
            plantsInGarden: this.countPlantsInGarden(),
            averageHealth: this.getAverageHealth()
        };
    }
    
    /**
     * 统计花园中的植物数量
     */
    countPlantsInGarden() {
        let count = 0;
        for (let y = 0; y < this.garden.height; y++) {
            for (let x = 0; x < this.garden.width; x++) {
                if (this.garden.cells[y][x].plant) {
                    count++;
                }
            }
        }
        return count;
    }
    
    /**
     * 计算平均健康度
     */
    getAverageHealth() {
        let totalHealth = 0;
        let plantCount = 0;
        
        for (let y = 0; y < this.garden.height; y++) {
            for (let x = 0; x < this.garden.width; x++) {
                const plant = this.garden.cells[y][x].plant;
                if (plant) {
                    totalHealth += plant.health;
                    plantCount++;
                }
            }
        }
        
        return plantCount > 0 ? totalHealth / plantCount : 1.0;
    }
    
    /**
     * 获取指定位置的格子
     */
    getCell(x, y) {
        if (!this.isValidCoordinate(x, y)) {
            return null;
        }
        return this.garden.cells[y][x];
    }
    
    /**
     * 获取花园数据
     */
    getGarden() {
        return this.garden;
    }
    
    /**
     * 获取玩家数据
     */
    getPlayer() {
        return this.player;
    }
    
    /**
     * 获取配置
     */
    getConfig() {
        return this.config;
    }
}

// 导出类（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameState;
}