/**
 * Renderer - 渲染系统
 * 负责游戏画面的渲染
 */

class Renderer {
    constructor(canvas, ctx, assetManager = null) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
        this.assetManager = assetManager;

        // 颜色配置
        this.colors = {
            // 土壤状态颜色
            soilDry: '#8B4513',      // 干燥土壤 - 棕色
            soilMoist: '#A0522D',    // 湿润土壤 - 深棕色
            soilWet: '#654321',      // 湿润土壤 - 更深棕色

            // 网格和边界
            gridLine: '#5D4037',     // 网格线 - 深棕色
            gridBorder: '#3E2723',   // 边界线 - 更深棕色

            // UI元素
            text: '#FFFFFF',
            background: '#2F4F2F',

            // 状态指示器
            needWater: '#FF6B6B',    // 需要浇水 - 红色
            canHarvest: '#4ECDC4',   // 可收获 - 青色
            healthy: '#45B7D1'       // 健康状态 - 蓝色
        };
    }

    /**
     * 主渲染方法
     */
    render(gameState) {
        // 清空画布
        this.clear();

        // 渲染背景
        this.renderBackground();

        // 渲染花园网格
        this.renderGarden(gameState);

        // 渲染UI元素
        this.renderUI(gameState);
    }

    /**
     * 清空画布
     */
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * 渲染背景
     */
    renderBackground() {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * 渲染花园网格
     */
    renderGarden(gameState) {
        if (!gameState || !gameState.garden) {
            this.renderEmptyGarden();
            return;
        }

        const garden = gameState.garden;

        // 计算网格渲染参数
        this.calculateGridLayout(garden);

        // 渲染土壤格子
        this.renderSoilCells(garden);

        // 渲染网格线
        this.renderGridLines(garden);

        // 渲染边界
        this.renderGridBorder(garden);

        // 渲染植物（如果有）
        this.renderPlants(garden);

        // 渲染状态指示器
        this.renderCellStatusIndicators(garden);
    }

    /**
     * 计算网格布局参数
     */
    calculateGridLayout(garden) {
        // 计算格子大小以适应Canvas
        const availableWidth = this.width - 40; // 留出边距
        const availableHeight = this.height - 40;

        const cellWidth = Math.floor(availableWidth / garden.width);
        const cellHeight = Math.floor(availableHeight / garden.height);

        // 使用较小的值保持正方形格子
        this.cellSize = Math.min(cellWidth, cellHeight, 80); // 最大80px
        this.cellSize = Math.max(this.cellSize, 32); // 最小32px

        // 计算网格总尺寸
        const gridWidth = garden.width * this.cellSize;
        const gridHeight = garden.height * this.cellSize;

        // 计算居中偏移
        this.gridOffsetX = (this.width - gridWidth) / 2;
        this.gridOffsetY = (this.height - gridHeight) / 2;

        // 更新花园的偏移量
        garden.setOffset(this.gridOffsetX, this.gridOffsetY);
        garden.cellSize = this.cellSize;
    }

    /**
     * 渲染土壤格子
     */
    renderSoilCells(garden) {
        for (let y = 0; y < garden.height; y++) {
            for (let x = 0; x < garden.width; x++) {
                const cell = garden.getCell(x, y);
                if (cell) {
                    this.renderSoilCell(cell, x, y);
                }
            }
        }
    }

    /**
     * 渲染单个土壤格子
     */
    renderSoilCell(cell, gridX, gridY) {
        const screenX = this.gridOffsetX + gridX * this.cellSize;
        const screenY = this.gridOffsetY + gridY * this.cellSize;

        // 根据土壤湿度选择颜色
        let soilColor;
        const soilState = cell.getSoilState();

        switch (soilState) {
            case 'wet':
                soilColor = this.colors.soilWet;
                break;
            case 'moist':
                soilColor = this.colors.soilMoist;
                break;
            case 'dry':
            default:
                soilColor = this.colors.soilDry;
                break;
        }

        // 绘制土壤背景
        this.ctx.fillStyle = soilColor;
        this.ctx.fillRect(screenX, screenY, this.cellSize, this.cellSize);

        // 添加土壤纹理效果
        this.renderSoilTexture(screenX, screenY, this.cellSize, soilState);

        // 如果格子为空，添加微妙的高光效果
        if (cell.isEmpty) {
            this.renderEmptyCellHighlight(screenX, screenY, this.cellSize);
        }
    }

    /**
     * 渲染土壤纹理
     */
    renderSoilTexture(x, y, size, soilState) {
        const ctx = this.ctx;

        // 保存当前状态
        ctx.save();

        // 设置纹理透明度
        ctx.globalAlpha = 0.3;

        // 根据土壤状态绘制不同的纹理点
        const dotCount = soilState === 'wet' ? 8 : soilState === 'moist' ? 6 : 4;
        const dotSize = soilState === 'wet' ? 2 : 1;

        ctx.fillStyle = soilState === 'wet' ? '#4A4A4A' : '#6B4423';

        for (let i = 0; i < dotCount; i++) {
            const dotX = x + Math.random() * (size - dotSize * 2) + dotSize;
            const dotY = y + Math.random() * (size - dotSize * 2) + dotSize;

            ctx.beginPath();
            ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
            ctx.fill();
        }

        // 恢复状态
        ctx.restore();
    }

    /**
     * 渲染空格子高光效果
     */
    renderEmptyCellHighlight(x, y, size) {
        const ctx = this.ctx;

        // 保存状态
        ctx.save();

        // 设置高光效果
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = '#FFFFFF';

        // 绘制内部高光
        const margin = 2;
        ctx.fillRect(x + margin, y + margin, size - margin * 2, size - margin * 2);

        // 恢复状态
        ctx.restore();
    }

    /**
     * 渲染网格线
     */
    renderGridLines(garden) {
        const ctx = this.ctx;

        ctx.strokeStyle = this.colors.gridLine;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;

        const startX = this.gridOffsetX;
        const startY = this.gridOffsetY;
        const endX = startX + garden.width * this.cellSize;
        const endY = startY + garden.height * this.cellSize;

        // 绘制垂直线
        for (let i = 0; i <= garden.width; i++) {
            const x = startX + i * this.cellSize;
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, endY);
            ctx.stroke();
        }

        // 绘制水平线
        for (let i = 0; i <= garden.height; i++) {
            const y = startY + i * this.cellSize;
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
            ctx.stroke();
        }

        // 恢复透明度
        ctx.globalAlpha = 1.0;
    }

    /**
     * 渲染网格边界
     */
    renderGridBorder(garden) {
        const ctx = this.ctx;

        const startX = this.gridOffsetX;
        const startY = this.gridOffsetY;
        const width = garden.width * this.cellSize;
        const height = garden.height * this.cellSize;

        // 绘制外边框
        ctx.strokeStyle = this.colors.gridBorder;
        ctx.lineWidth = 3;
        ctx.strokeRect(startX, startY, width, height);

        // 绘制内阴影效果
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(startX + 1, startY + 1, width - 2, height - 2);
        ctx.restore();
    }

    /**
     * 渲染格子状态指示器
     */
    renderCellStatusIndicators(garden) {
        for (let y = 0; y < garden.height; y++) {
            for (let x = 0; x < garden.width; x++) {
                const cell = garden.getCell(x, y);
                if (cell) {
                    this.renderCellStatusIndicator(cell, x, y);
                }
            }
        }
    }

    /**
     * 渲染单个格子的状态指示器
     */
    renderCellStatusIndicator(cell, gridX, gridY) {
        const screenX = this.gridOffsetX + gridX * this.cellSize;
        const screenY = this.gridOffsetY + gridY * this.cellSize;
        const centerX = screenX + this.cellSize / 2;
        const centerY = screenY + this.cellSize / 2;

        const ctx = this.ctx;

        // 如果有植物且可以收获，显示收获指示器
        if (cell.plant && cell.plant.canHarvest()) {
            this.renderHarvestIndicator(centerX, centerY - this.cellSize * 0.3);
        }
        // 如果需要浇水，显示浇水指示器
        else if (cell.needsWater()) {
            this.renderWaterIndicator(centerX, centerY - this.cellSize * 0.3);
        }
        // 如果植物健康，显示健康指示器
        else if (cell.plant && !cell.plant.needsWater()) {
            this.renderHealthyIndicator(centerX, centerY - this.cellSize * 0.3);
        }
    }

    /**
     * 渲染收获指示器
     */
    renderHarvestIndicator(x, y) {
        const ctx = this.ctx;
        const radius = 6;

        // 绘制背景圆圈
        ctx.fillStyle = this.colors.canHarvest;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // 绘制边框
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 绘制收获图标（简单的星形）
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', x, y);
    }

    /**
     * 渲染浇水指示器
     */
    renderWaterIndicator(x, y) {
        const ctx = this.ctx;
        const radius = 6;

        // 绘制背景圆圈
        ctx.fillStyle = this.colors.needWater;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // 绘制边框
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 绘制水滴图标
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💧', x, y);
    }

    /**
     * 渲染健康指示器
     */
    renderHealthyIndicator(x, y) {
        const ctx = this.ctx;
        const radius = 4;

        // 绘制小的健康指示点
        ctx.fillStyle = this.colors.healthy;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // 绘制边框
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    /**
     * 渲染空花园（当没有花园数据时）
     */
    renderEmptyGarden() {
        // 绘制占位符网格
        const gridSize = 8;
        const cellSize = Math.min(this.width, this.height) / (gridSize + 2);
        const offsetX = (this.width - gridSize * cellSize) / 2;
        const offsetY = (this.height - gridSize * cellSize) / 2;

        // 绘制占位符格子
        this.ctx.fillStyle = this.colors.soilDry;
        this.ctx.globalAlpha = 0.3;

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const screenX = offsetX + x * cellSize;
                const screenY = offsetY + y * cellSize;
                this.ctx.fillRect(screenX, screenY, cellSize, cellSize);
            }
        }

        // 绘制占位符网格线
        this.ctx.strokeStyle = this.colors.gridLine;
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.2;

        for (let i = 0; i <= gridSize; i++) {
            const x = offsetX + i * cellSize;
            const y = offsetY + i * cellSize;

            // 垂直线
            this.ctx.beginPath();
            this.ctx.moveTo(x, offsetY);
            this.ctx.lineTo(x, offsetY + gridSize * cellSize);
            this.ctx.stroke();

            // 水平线
            this.ctx.beginPath();
            this.ctx.moveTo(offsetX, y);
            this.ctx.lineTo(offsetX + gridSize * cellSize, y);
            this.ctx.stroke();
        }

        this.ctx.globalAlpha = 1.0;
    }

    /**
     * 渲染植物
     */
    renderPlants(garden) {
        for (let y = 0; y < garden.height; y++) {
            for (let x = 0; x < garden.width; x++) {
                const cell = garden.getCell(x, y);
                if (cell && cell.plant) {
                    this.renderPlant(cell.plant, x, y);
                }
            }
        }
    }

    /**
     * 渲染单个植物
     */
    renderPlant(plant, gridX, gridY) {
        const screenX = this.gridOffsetX + gridX * this.cellSize;
        const screenY = this.gridOffsetY + gridY * this.cellSize;
        const centerX = screenX + this.cellSize / 2;
        const centerY = screenY + this.cellSize / 2;

        // 根据植物类型和成长阶段渲染
        this.renderPlantByTypeAndStage(plant, centerX, centerY);

        // 渲染植物健康状态效果
        this.renderPlantHealthEffects(plant, centerX, centerY);

        // 渲染成长进度指示器
        this.renderGrowthProgress(plant, screenX, screenY);
    }

    /**
     * 根据植物类型和成长阶段渲染植物
     */
    renderPlantByTypeAndStage(plant, centerX, centerY) {
        const ctx = this.ctx;
        const stage = plant.stage;
        const type = plant.type;

        // 保存当前状态
        ctx.save();

        // 根据健康状态调整透明度
        const healthStatus = plant.getHealthStatus();
        if (healthStatus === 'dying') {
            ctx.globalAlpha = 0.5;
        } else if (healthStatus === 'poor') {
            ctx.globalAlpha = 0.7;
        }

        switch (type) {
            case 'flower':
                this.renderFlower(stage, centerX, centerY);
                break;
            case 'vegetable':
                this.renderVegetable(stage, centerX, centerY);
                break;
            case 'tree':
                this.renderTree(stage, centerX, centerY);
                break;
            default:
                this.renderGenericPlant(stage, centerX, centerY);
                break;
        }

        // 恢复状态
        ctx.restore();
    }

    /**
     * 渲染花朵植物
     */
    renderFlower(stage, centerX, centerY) {
        const ctx = this.ctx;
        const size = this.getPlantSize(stage);

        switch (stage) {
            case 0: // SEED
                this.renderSeed(centerX, centerY, '#8B4513');
                break;
            case 1: // SPROUT
                this.renderSprout(centerX, centerY, size, '#90EE90');
                break;
            case 2: // YOUNG
                this.renderYoungFlower(centerX, centerY, size);
                break;
            case 3: // MATURE
                this.renderMatureFlower(centerX, centerY, size);
                break;
            case 4: // READY
                this.renderReadyFlower(centerX, centerY, size);
                break;
        }
    }

    /**
     * 渲染蔬菜植物
     */
    renderVegetable(stage, centerX, centerY) {
        const ctx = this.ctx;
        const size = this.getPlantSize(stage);

        switch (stage) {
            case 0: // SEED
                this.renderSeed(centerX, centerY, '#654321');
                break;
            case 1: // SPROUT
                this.renderSprout(centerX, centerY, size, '#228B22');
                break;
            case 2: // YOUNG
                this.renderYoungVegetable(centerX, centerY, size);
                break;
            case 3: // MATURE
                this.renderMatureVegetable(centerX, centerY, size);
                break;
            case 4: // READY
                this.renderReadyVegetable(centerX, centerY, size);
                break;
        }
    }

    /**
     * 渲染树木植物
     */
    renderTree(stage, centerX, centerY) {
        const ctx = this.ctx;
        const size = this.getPlantSize(stage);

        switch (stage) {
            case 0: // SEED
                this.renderSeed(centerX, centerY, '#4A4A4A');
                break;
            case 1: // SPROUT
                this.renderSprout(centerX, centerY, size, '#006400');
                break;
            case 2: // YOUNG
                this.renderYoungTree(centerX, centerY, size);
                break;
            case 3: // MATURE
                this.renderMatureTree(centerX, centerY, size);
                break;
            case 4: // READY
                this.renderReadyTree(centerX, centerY, size);
                break;
        }
    }

    /**
     * 获取植物大小（基于成长阶段）
     */
    getPlantSize(stage) {
        const baseSize = Math.min(this.cellSize * 0.3, 20);
        const sizeMultipliers = [0.3, 0.5, 0.7, 0.9, 1.0];
        return baseSize * sizeMultipliers[stage];
    }

    /**
     * 渲染种子
     */
    renderSeed(centerX, centerY, color) {
        const ctx = this.ctx;
        const radius = 3;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // 添加高光效果
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(centerX - 1, centerY - 1, radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * 渲染幼芽
     */
    renderSprout(centerX, centerY, size, color) {
        const ctx = this.ctx;

        // 绘制茎
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + size * 0.5);
        ctx.lineTo(centerX, centerY - size * 0.3);
        ctx.stroke();

        // 绘制叶子
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(centerX - size * 0.3, centerY - size * 0.1, size * 0.2, size * 0.4, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(centerX + size * 0.3, centerY - size * 0.1, size * 0.2, size * 0.4, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * 渲染年轻花朵
     */
    renderYoungFlower(centerX, centerY, size) {
        const ctx = this.ctx;

        // 绘制茎
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + size * 0.8);
        ctx.lineTo(centerX, centerY - size * 0.2);
        ctx.stroke();

        // 绘制叶子
        ctx.fillStyle = '#90EE90';
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            const leafX = centerX + Math.cos(angle) * size * 0.4;
            const leafY = centerY + Math.sin(angle) * size * 0.4;

            ctx.beginPath();
            ctx.ellipse(leafX, leafY, size * 0.15, size * 0.3, angle, 0, Math.PI * 2);
            ctx.fill();
        }

        // 绘制花蕾
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.arc(centerX, centerY - size * 0.2, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * 渲染成熟花朵
     */
    renderMatureFlower(centerX, centerY, size) {
        const ctx = this.ctx;

        // 绘制茎
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + size * 0.9);
        ctx.lineTo(centerX, centerY - size * 0.3);
        ctx.stroke();

        // 绘制叶子
        ctx.fillStyle = '#32CD32';
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI * 2) / 4;
            const leafX = centerX + Math.cos(angle) * size * 0.5;
            const leafY = centerY + Math.sin(angle) * size * 0.5;

            ctx.beginPath();
            ctx.ellipse(leafX, leafY, size * 0.2, size * 0.4, angle, 0, Math.PI * 2);
            ctx.fill();
        }

        // 绘制花瓣
        ctx.fillStyle = '#FF69B4';
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const petalX = centerX + Math.cos(angle) * size * 0.3;
            const petalY = centerY - size * 0.3 + Math.sin(angle) * size * 0.3;

            ctx.beginPath();
            ctx.ellipse(petalX, petalY, size * 0.15, size * 0.25, angle, 0, Math.PI * 2);
            ctx.fill();
        }

        // 绘制花心
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(centerX, centerY - size * 0.3, size * 0.1, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * 渲染可收获花朵
     */
    renderReadyFlower(centerX, centerY, size) {
        const ctx = this.ctx;

        // 绘制茎
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + size);
        ctx.lineTo(centerX, centerY - size * 0.4);
        ctx.stroke();

        // 绘制叶子
        ctx.fillStyle = '#32CD32';
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const leafX = centerX + Math.cos(angle) * size * 0.6;
            const leafY = centerY + Math.sin(angle) * size * 0.6;

            ctx.beginPath();
            ctx.ellipse(leafX, leafY, size * 0.25, size * 0.5, angle, 0, Math.PI * 2);
            ctx.fill();
        }

        // 绘制大花瓣
        ctx.fillStyle = '#FF1493';
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8;
            const petalX = centerX + Math.cos(angle) * size * 0.4;
            const petalY = centerY - size * 0.4 + Math.sin(angle) * size * 0.4;

            ctx.beginPath();
            ctx.ellipse(petalX, petalY, size * 0.2, size * 0.3, angle, 0, Math.PI * 2);
            ctx.fill();
        }

        // 绘制花心
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(centerX, centerY - size * 0.4, size * 0.15, 0, Math.PI * 2);
        ctx.fill();

        // 添加闪烁效果
        this.renderSparkleEffect(centerX, centerY - size * 0.4, size * 0.8);
    }

    /**
     * 渲染年轻蔬菜
     */
    renderYoungVegetable(centerX, centerY, size) {
        const ctx = this.ctx;

        // 绘制茎
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + size * 0.6);
        ctx.lineTo(centerX, centerY - size * 0.2);
        ctx.stroke();

        // 绘制叶子
        ctx.fillStyle = '#90EE90';
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            const leafX = centerX + Math.cos(angle) * size * 0.3;
            const leafY = centerY + Math.sin(angle) * size * 0.3;

            ctx.beginPath();
            ctx.ellipse(leafX, leafY, size * 0.2, size * 0.3, angle, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /**
     * 渲染成熟蔬菜
     */
    renderMatureVegetable(centerX, centerY, size) {
        const ctx = this.ctx;

        // 绘制茎
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + size * 0.7);
        ctx.lineTo(centerX, centerY - size * 0.1);
        ctx.stroke();

        // 绘制大叶子
        ctx.fillStyle = '#32CD32';
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const leafX = centerX + Math.cos(angle) * size * 0.4;
            const leafY = centerY + Math.sin(angle) * size * 0.4;

            ctx.beginPath();
            ctx.ellipse(leafX, leafY, size * 0.25, size * 0.4, angle, 0, Math.PI * 2);
            ctx.fill();
        }

        // 绘制蔬菜果实
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.arc(centerX, centerY - size * 0.1, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * 渲染可收获蔬菜
     */
    renderReadyVegetable(centerX, centerY, size) {
        const ctx = this.ctx;

        // 绘制茎
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + size * 0.8);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();

        // 绘制大叶子
        ctx.fillStyle = '#32CD32';
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8;
            const leafX = centerX + Math.cos(angle) * size * 0.5;
            const leafY = centerY + Math.sin(angle) * size * 0.5;

            ctx.beginPath();
            ctx.ellipse(leafX, leafY, size * 0.3, size * 0.5, angle, 0, Math.PI * 2);
            ctx.fill();
        }

        // 绘制大蔬菜果实
        ctx.fillStyle = '#FF4500';
        ctx.beginPath();
        ctx.arc(centerX, centerY, size * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // 添加高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(centerX - size * 0.1, centerY - size * 0.1, size * 0.15, 0, Math.PI * 2);
        ctx.fill();

        // 添加闪烁效果
        this.renderSparkleEffect(centerX, centerY, size * 0.8);
    }

    /**
     * 渲染年轻树木
     */
    renderYoungTree(centerX, centerY, size) {
        const ctx = this.ctx;

        // 绘制树干
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(centerX - size * 0.1, centerY + size * 0.2, size * 0.2, size * 0.6);

        // 绘制小树冠
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(centerX, centerY, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * 渲染成熟树木
     */
    renderMatureTree(centerX, centerY, size) {
        const ctx = this.ctx;

        // 绘制树干
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(centerX - size * 0.15, centerY + size * 0.1, size * 0.3, size * 0.7);

        // 绘制树冠
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(centerX, centerY - size * 0.1, size * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // 添加树叶细节
        ctx.fillStyle = '#32CD32';
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const leafX = centerX + Math.cos(angle) * size * 0.3;
            const leafY = centerY - size * 0.1 + Math.sin(angle) * size * 0.3;

            ctx.beginPath();
            ctx.arc(leafX, leafY, size * 0.15, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /**
     * 渲染可收获树木
     */
    renderReadyTree(centerX, centerY, size) {
        const ctx = this.ctx;

        // 绘制粗树干
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(centerX - size * 0.2, centerY, size * 0.4, size * 0.8);

        // 绘制大树冠
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(centerX, centerY - size * 0.2, size * 0.8, 0, Math.PI * 2);
        ctx.fill();

        // 添加丰富的树叶
        ctx.fillStyle = '#32CD32';
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8;
            const leafX = centerX + Math.cos(angle) * size * 0.5;
            const leafY = centerY - size * 0.2 + Math.sin(angle) * size * 0.5;

            ctx.beginPath();
            ctx.arc(leafX, leafY, size * 0.2, 0, Math.PI * 2);
            ctx.fill();
        }

        // 添加果实
        ctx.fillStyle = '#FF6347';
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI * 2) / 4 + Math.PI / 4;
            const fruitX = centerX + Math.cos(angle) * size * 0.4;
            const fruitY = centerY - size * 0.2 + Math.sin(angle) * size * 0.4;

            ctx.beginPath();
            ctx.arc(fruitX, fruitY, size * 0.08, 0, Math.PI * 2);
            ctx.fill();
        }

        // 添加闪烁效果
        this.renderSparkleEffect(centerX, centerY - size * 0.2, size);
    }

    /**
     * 渲染通用植物（备用）
     */
    renderGenericPlant(stage, centerX, centerY) {
        const ctx = this.ctx;
        const size = this.getPlantSize(stage);

        // 简单的圆形植物表示
        ctx.fillStyle = '#90EE90';
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
        ctx.fill();

        // 添加边框
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    /**
     * 渲染植物健康状态效果
     */
    renderPlantHealthEffects(plant, centerX, centerY) {
        const ctx = this.ctx;
        const healthStatus = plant.getHealthStatus();

        // 根据健康状态添加视觉效果
        switch (healthStatus) {
            case 'dying':
                // 枯萎效果 - 添加棕色斑点
                ctx.fillStyle = 'rgba(139, 69, 19, 0.6)';
                for (let i = 0; i < 3; i++) {
                    const spotX = centerX + (Math.random() - 0.5) * this.cellSize * 0.4;
                    const spotY = centerY + (Math.random() - 0.5) * this.cellSize * 0.4;
                    ctx.beginPath();
                    ctx.arc(spotX, spotY, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
            case 'poor':
                // 不健康效果 - 添加黄色斑点
                ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
                for (let i = 0; i < 2; i++) {
                    const spotX = centerX + (Math.random() - 0.5) * this.cellSize * 0.3;
                    const spotY = centerY + (Math.random() - 0.5) * this.cellSize * 0.3;
                    ctx.beginPath();
                    ctx.arc(spotX, spotY, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
            case 'excellent':
                // 优秀健康状态 - 添加微妙的光晕
                ctx.save();
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = '#90EE90';
                ctx.beginPath();
                ctx.arc(centerX, centerY, this.cellSize * 0.4, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;
        }
    }

    /**
     * 渲染成长进度指示器
     */
    renderGrowthProgress(plant, screenX, screenY) {
        if (plant.stage >= 4) return; // 已完全成熟，不显示进度

        const ctx = this.ctx;
        const progress = plant.getGrowthProgress();

        // 进度条位置和尺寸
        const barWidth = this.cellSize * 0.8;
        const barHeight = 4;
        const barX = screenX + (this.cellSize - barWidth) / 2;
        const barY = screenY + this.cellSize - barHeight - 2;

        // 绘制进度条背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // 绘制进度条
        const progressWidth = barWidth * progress;
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(barX, barY, progressWidth, barHeight);

        // 添加进度条边框
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    /**
     * 渲染闪烁效果（用于可收获植物）
     */
    renderSparkleEffect(centerX, centerY, radius) {
        const ctx = this.ctx;
        const time = Date.now() * 0.005; // 控制闪烁速度

        ctx.save();
        ctx.globalAlpha = 0.6 + 0.4 * Math.sin(time);

        // 绘制星形闪烁
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2 + time;
            const sparkleX = centerX + Math.cos(angle) * radius * 0.6;
            const sparkleY = centerY + Math.sin(angle) * radius * 0.6;

            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    /**
     * 渲染成长进度指示器
     */
    renderGrowthProgress(plant, screenX, screenY) {
        if (plant.stage >= 4) return; // 已完全成熟，不显示进度

        const ctx = this.ctx;
        const progress = plant.getGrowthProgress();

        // 进度条位置和尺寸
        const barWidth = this.cellSize * 0.8;
        const barHeight = 4;
        const barX = screenX + (this.cellSize - barWidth) / 2;
        const barY = screenY + this.cellSize - barHeight - 2;

        // 绘制进度条背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // 绘制进度条
        const progressWidth = barWidth * progress;
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(barX, barY, progressWidth, barHeight);

        // 添加进度条边框
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
    ctx.globalAlpha = 0.6 + 0.4 * Math.sin(time);

    // 绘制星形闪烁
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2 + time;
        const sparkleX = centerX + Math.cos(angle) * radius * 0.6;
        const sparkleY = centerY + Math.sin(angle) * radius * 0.6;

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

/**
 * 渲染UI元素
 */
renderUI(gameState) {
    // 如果没有花园数据，显示欢迎信息
    if (!gameState || !gameState.garden) {
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            '欢迎来到花园游戏!',
            this.width / 2,
            this.height / 2 - 20
        );

        this.ctx.font = '16px Arial';
        this.ctx.fillText(
            '选择工具开始种植你的花园',
            this.width / 2,
            this.height / 2 + 20
        );
        return;
    }

    // 渲染游戏信息（如果需要的话）
    // 这里可以添加积分、植物数量等信息的渲染
    // 但主要的UI元素已经在HTML中定义了
}

/**
 * 处理尺寸变化
 */
onResize(width, height) {
    this.width = width;
    this.height = height;

    console.log(`渲染器尺寸更新: ${width}x${height}`);
}

/**
 * 获取网格坐标（从屏幕坐标转换）
 */
getGridCoordinates(screenX, screenY, garden) {
    if (!garden || !this.gridOffsetX || !this.cellSize) {
        return { x: -1, y: -1 };
    }

    const relativeX = screenX - this.gridOffsetX;
    const relativeY = screenY - this.gridOffsetY;

    const gridX = Math.floor(relativeX / this.cellSize);
    const gridY = Math.floor(relativeY / this.cellSize);

    // 确保坐标在有效范围内
    if (gridX >= 0 && gridX < garden.width && gridY >= 0 && gridY < garden.height) {
        return { x: gridX, y: gridY };
    }

    return { x: -1, y: -1 };
}

/**
 * 获取屏幕坐标（从网格坐标转换）
 */
getScreenCoordinates(gridX, gridY) {
    if (!this.gridOffsetX || !this.cellSize) {
        return { x: 0, y: 0 };
    }

    return {
        x: this.gridOffsetX + gridX * this.cellSize + this.cellSize / 2,
        y: this.gridOffsetY + gridY * this.cellSize + this.cellSize / 2
    };
}

/**
 * 检查屏幕坐标是否在网格范围内
 */
isPointInGrid(screenX, screenY, garden) {
    if (!garden || !this.gridOffsetX || !this.cellSize) {
        return false;
    }

    const gridCoords = this.getGridCoordinates(screenX, screenY, garden);
    return gridCoords.x !== -1 && gridCoords.y !== -1;
}

/**
 * 渲染收获动画效果
 */
renderHarvestEffect(x, y, plantType, reward) {
    const ctx = this.ctx;
    const time = Date.now() * 0.01;

    // 保存当前状态
    ctx.save();

    // 渲染收获光环效果
    ctx.globalAlpha = 0.6 + 0.4 * Math.sin(time);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 30 + 10 * Math.sin(time * 0.5), 0, Math.PI * 2);
    ctx.stroke();

    // 渲染星星效果
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6 + time * 0.1;
        const starX = x + Math.cos(angle) * (25 + 5 * Math.sin(time));
        const starY = y + Math.sin(angle) * (25 + 5 * Math.sin(time));

        this.renderStar(starX, starY, 4, '#FFD700');
    }

    // 恢复状态
    ctx.restore();
}

/**
 * 渲染星星
 */
renderStar(x, y, size, color) {
    const ctx = this.ctx;

    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(x, y);

    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const outerRadius = size;
        const innerRadius = size * 0.4;

        if (i === 0) {
            ctx.moveTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
        } else {
            ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
        }

        const innerAngle = angle + Math.PI / 5;
        ctx.lineTo(Math.cos(innerAngle) * innerRadius, Math.sin(innerAngle) * innerRadius);
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

/**
 * 渲染收获后的土壤重置效果
 */
renderSoilResetEffect(x, y) {
    const ctx = this.ctx;
    const time = Date.now() * 0.005;

    ctx.save();

    // 渲染土壤翻新效果
    ctx.globalAlpha = 0.3 + 0.2 * Math.sin(time);
    ctx.fillStyle = '#8B4513';

    // 绘制翻新的土壤纹理
    for (let i = 0; i < 5; i++) {
        const offsetX = (Math.random() - 0.5) * this.cellSize * 0.6;
        const offsetY = (Math.random() - 0.5) * this.cellSize * 0.6;

        ctx.beginPath();
        ctx.arc(x + offsetX, y + offsetY, 2 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}
}

// 导出类（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Renderer;
}