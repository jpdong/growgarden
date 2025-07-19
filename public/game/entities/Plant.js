/**
 * 植物类型枚举
 */
const PlantType = {
    FLOWER: 'flower',
    VEGETABLE: 'vegetable', 
    TREE: 'tree'
};

/**
 * 植物成长阶段枚举
 */
const GrowthStage = {
    SEED: 0,      // 种子
    SPROUT: 1,    // 发芽
    YOUNG: 2,     // 幼苗
    MATURE: 3,    // 成熟
    READY: 4      // 可收获
};

/**
 * 植物健康状态枚举
 */
const HealthStatus = {
    EXCELLENT: 'excellent',  // 优秀
    GOOD: 'good',           // 良好
    FAIR: 'fair',           // 一般
    POOR: 'poor',           // 较差
    DYING: 'dying'          // 濒死
};

/**
 * 植物配置 - 定义不同植物类型的成长时间和特性
 */
const PlantConfig = {
    [PlantType.FLOWER]: {
        name: '花朵',
        growthTimes: [2000, 3000, 4000, 5000], // 每个阶段的成长时间(毫秒)
        waterNeed: 0.4,                        // 需水量
        harvestReward: 10,                     // 收获奖励
        maxHealth: 100
    },
    [PlantType.VEGETABLE]: {
        name: '蔬菜',
        growthTimes: [1500, 2500, 3500, 4500],
        waterNeed: 0.6,
        harvestReward: 15,
        maxHealth: 100
    },
    [PlantType.TREE]: {
        name: '树木',
        growthTimes: [4000, 6000, 8000, 10000],
        waterNeed: 0.3,
        harvestReward: 25,
        maxHealth: 100
    }
};

/**
 * Plant - 植物类
 */
class Plant {
    constructor(type = PlantType.FLOWER) {
        this.id = this.generateId();
        this.type = type;
        this.stage = GrowthStage.SEED;
        this.plantedTime = Date.now();
        this.lastWatered = Date.now();
        this.lastUpdated = Date.now();
        this.health = PlantConfig[type].maxHealth;
        this.waterLevel = 1.0; // 植物水分水平 (0-1)
        
        // 获取植物配置
        this.config = PlantConfig[type];
        
        // 成长进度追踪
        this.stageStartTime = Date.now();
        this.totalGrowthTime = 0;
    }

    /**
     * 生成唯一ID
     */
    generateId() {
        return 'plant_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 更新植物状态
     */
    update(deltaTime) {
        const now = Date.now();
        const timeSinceLastUpdate = now - this.lastUpdated;
        
        // 更新水分水平 - 随时间自然消耗
        this.updateWaterLevel(timeSinceLastUpdate);
        
        // 更新健康状态
        this.updateHealth();
        
        // 检查成长进度
        this.updateGrowthStage(timeSinceLastUpdate);
        
        this.lastUpdated = now;
    }

    /**
     * 更新水分水平
     */
    updateWaterLevel(deltaTime) {
        // 水分消耗率 - 健康状态越差消耗越快
        const baseConsumptionRate = 0.00002; // 每毫秒基础消耗率
        const healthMultiplier = this.getHealthMultiplier();
        const consumptionRate = baseConsumptionRate * healthMultiplier;
        
        this.waterLevel = Math.max(0, this.waterLevel - (consumptionRate * deltaTime));
    }

    /**
     * 更新健康状态
     */
    updateHealth() {
        const timeSinceWatered = Date.now() - this.lastWatered;
        const maxTimeWithoutWater = 10000; // 10秒不浇水开始影响健康
        
        // 根据水分水平和浇水时间计算健康值
        let healthChange = 0;
        
        if (this.waterLevel < 0.2) {
            // 水分严重不足，健康下降
            healthChange = -0.1;
        } else if (this.waterLevel < 0.4) {
            // 水分不足，健康缓慢下降
            healthChange = -0.05;
        } else if (this.waterLevel > 0.7) {
            // 水分充足，健康缓慢恢复
            healthChange = 0.02;
        }
        
        // 长时间不浇水额外惩罚
        if (timeSinceWatered > maxTimeWithoutWater) {
            healthChange -= 0.05;
        }
        
        this.health = Math.max(0, Math.min(this.config.maxHealth, this.health + healthChange));
    }

    /**
     * 更新成长阶段
     */
    updateGrowthStage(deltaTime) {
        if (this.stage >= GrowthStage.READY) {
            return; // 已经完全成熟
        }
        
        // 只有健康状态良好时才能正常成长
        if (this.getHealthStatus() === HealthStatus.DYING) {
            return; // 濒死状态不成长
        }
        
        const currentStageTime = Date.now() - this.stageStartTime;
        const requiredTime = this.config.growthTimes[this.stage];
        
        // 健康状态影响成长速度
        const healthMultiplier = this.getGrowthSpeedMultiplier();
        const adjustedRequiredTime = requiredTime / healthMultiplier;
        
        if (currentStageTime >= adjustedRequiredTime) {
            this.advanceToNextStage();
        }
    }

    /**
     * 进入下一个成长阶段
     */
    advanceToNextStage() {
        if (this.stage < GrowthStage.READY) {
            this.stage++;
            this.stageStartTime = Date.now();
            this.totalGrowthTime += Date.now() - this.stageStartTime;
        }
    }

    /**
     * 浇水
     */
    water(amount = 0.4) {
        this.waterLevel = Math.min(1.0, this.waterLevel + amount);
        this.lastWatered = Date.now();
        
        // 浇水有助于健康恢复
        this.health = Math.min(this.config.maxHealth, this.health + 2);
    }

    /**
     * 检查是否需要浇水
     */
    needsWater() {
        return this.waterLevel < this.config.waterNeed || 
               (Date.now() - this.lastWatered) > 8000; // 8秒未浇水
    }

    /**
     * 检查是否可以收获
     */
    canHarvest() {
        return this.stage === GrowthStage.READY && this.health > 20;
    }

    /**
     * 获取健康状态
     */
    getHealthStatus() {
        const healthPercent = this.health / this.config.maxHealth;
        
        if (healthPercent >= 0.9) return HealthStatus.EXCELLENT;
        if (healthPercent >= 0.7) return HealthStatus.GOOD;
        if (healthPercent >= 0.5) return HealthStatus.FAIR;
        if (healthPercent >= 0.2) return HealthStatus.POOR;
        return HealthStatus.DYING;
    }

    /**
     * 获取健康状态对水分消耗的影响倍数
     */
    getHealthMultiplier() {
        const status = this.getHealthStatus();
        switch (status) {
            case HealthStatus.EXCELLENT: return 0.8;
            case HealthStatus.GOOD: return 1.0;
            case HealthStatus.FAIR: return 1.2;
            case HealthStatus.POOR: return 1.5;
            case HealthStatus.DYING: return 2.0;
            default: return 1.0;
        }
    }

    /**
     * 获取健康状态对成长速度的影响倍数
     */
    getGrowthSpeedMultiplier() {
        const status = this.getHealthStatus();
        switch (status) {
            case HealthStatus.EXCELLENT: return 1.2;
            case HealthStatus.GOOD: return 1.0;
            case HealthStatus.FAIR: return 0.8;
            case HealthStatus.POOR: return 0.5;
            case HealthStatus.DYING: return 0.1;
            default: return 1.0;
        }
    }

    /**
     * 获取成长进度百分比
     */
    getGrowthProgress() {
        if (this.stage >= GrowthStage.READY) {
            return 1.0;
        }
        
        const currentStageTime = Date.now() - this.stageStartTime;
        const requiredTime = this.config.growthTimes[this.stage];
        const healthMultiplier = this.getGrowthSpeedMultiplier();
        const adjustedRequiredTime = requiredTime / healthMultiplier;
        
        return Math.min(1.0, currentStageTime / adjustedRequiredTime);
    }

    /**
     * 获取植物显示名称
     */
    getDisplayName() {
        const stageName = this.getStageName();
        return `${this.config.name}(${stageName})`;
    }

    /**
     * 获取成长阶段名称
     */
    getStageName() {
        switch (this.stage) {
            case GrowthStage.SEED: return '种子';
            case GrowthStage.SPROUT: return '发芽';
            case GrowthStage.YOUNG: return '幼苗';
            case GrowthStage.MATURE: return '成熟';
            case GrowthStage.READY: return '可收获';
            default: return '未知';
        }
    }

    /**
     * 获取收获奖励
     */
    getHarvestReward() {
        if (!this.canHarvest()) {
            return 0;
        }
        
        // 健康状态影响收获奖励
        const healthBonus = this.health / this.config.maxHealth;
        return Math.floor(this.config.harvestReward * healthBonus);
    }

    /**
     * 获取植物状态信息
     */
    getStatusInfo() {
        return {
            id: this.id,
            type: this.type,
            stage: this.stage,
            stageName: this.getStageName(),
            health: this.health,
            healthStatus: this.getHealthStatus(),
            waterLevel: this.waterLevel,
            needsWater: this.needsWater(),
            canHarvest: this.canHarvest(),
            growthProgress: this.getGrowthProgress(),
            displayName: this.getDisplayName(),
            harvestReward: this.getHarvestReward()
        };
    }

    /**
     * 序列化植物数据用于保存
     */
    serialize() {
        return {
            id: this.id,
            type: this.type,
            stage: this.stage,
            plantedTime: this.plantedTime,
            lastWatered: this.lastWatered,
            lastUpdated: this.lastUpdated,
            health: this.health,
            waterLevel: this.waterLevel,
            stageStartTime: this.stageStartTime,
            totalGrowthTime: this.totalGrowthTime
        };
    }

    /**
     * 从序列化数据创建植物实例
     */
    static deserialize(data) {
        const plant = new Plant(data.type);
        
        plant.id = data.id;
        plant.stage = data.stage;
        plant.plantedTime = data.plantedTime;
        plant.lastWatered = data.lastWatered;
        plant.lastUpdated = data.lastUpdated;
        plant.health = data.health;
        plant.waterLevel = data.waterLevel;
        plant.stageStartTime = data.stageStartTime;
        plant.totalGrowthTime = data.totalGrowthTime;
        
        return plant;
    }

    /**
     * 创建指定类型的植物
     */
    static createPlant(type) {
        if (!PlantConfig[type]) {
            throw new Error(`Unknown plant type: ${type}`);
        }
        return new Plant(type);
    }
}

// 导出类和枚举供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        Plant, 
        PlantType, 
        GrowthStage, 
        HealthStatus, 
        PlantConfig 
    };
}