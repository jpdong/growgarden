/**
 * GardenCell - 表示花园中的单个土壤格子
 */
class GardenCell {
    constructor(x, y) {
        this.x = x;                    // 网格坐标 x
        this.y = y;                    // 网格坐标 y
        this.plant = null;             // 种植的植物对象
        this.soilMoisture = 0.5;       // 土壤湿度 (0-1)
        this.lastWatered = 0;          // 上次浇水时间
        this.isEmpty = true;           // 是否为空
    }

    /**
     * 检查格子是否可以种植
     */
    canPlant() {
        return this.isEmpty && this.plant === null;
    }

    /**
     * 种植植物
     */
    plantSeed(plant) {
        if (this.canPlant()) {
            this.plant = plant;
            this.isEmpty = false;
            return true;
        }
        return false;
    }

    /**
     * 收获植物
     */
    harvest() {
        if (this.plant && this.plant.canHarvest()) {
            const harvestedPlant = this.plant;
            this.plant = null;
            this.isEmpty = true;
            this.soilMoisture = 0.3; // 收获后土壤湿度降低
            return harvestedPlant;
        }
        return null;
    }

    /**
     * 浇水
     */
    water(amount = 0.3) {
        this.soilMoisture = Math.min(1.0, this.soilMoisture + amount);
        this.lastWatered = Date.now();
        if (this.plant) {
            this.plant.water();
        }
    }

    /**
     * 更新格子状态
     */
    update(deltaTime) {
        // 土壤湿度随时间自然蒸发
        const evaporationRate = 0.00001; // 每毫秒蒸发率
        this.soilMoisture = Math.max(0, this.soilMoisture - (evaporationRate * deltaTime));

        // 更新植物状态
        if (this.plant) {
            this.plant.update(deltaTime);
        }
    }

    /**
     * 获取土壤状态
     */
    getSoilState() {
        if (this.soilMoisture > 0.7) return 'wet';
        if (this.soilMoisture > 0.3) return 'moist';
        return 'dry';
    }

    /**
     * 检查是否需要浇水
     */
    needsWater() {
        return this.soilMoisture < 0.3 || (this.plant && this.plant.needsWater());
    }
}

/**
 * GardenGrid - 管理整个花园网格系统
 */
class GardenGrid {
    constructor(width = 8, height = 6, cellSize = 64) {
        this.width = width;           // 网格宽度（格子数）
        this.height = height;         // 网格高度（格子数）
        this.cellSize = cellSize;     // 每个格子的像素大小
        this.cells = [];              // 二维数组存储格子
        this.offsetX = 0;             // 渲染偏移 X
        this.offsetY = 0;             // 渲染偏移 Y
        
        this.initializeGrid();
    }

    /**
     * 初始化网格
     */
    initializeGrid() {
        this.cells = [];
        for (let y = 0; y < this.height; y++) {
            this.cells[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.cells[y][x] = new GardenCell(x, y);
            }
        }
    }

    /**
     * 获取指定坐标的格子
     */
    getCell(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.cells[y][x];
        }
        return null;
    }

    /**
     * 屏幕坐标转换为网格坐标
     */
    screenToGrid(screenX, screenY) {
        const gridX = Math.floor((screenX - this.offsetX) / this.cellSize);
        const gridY = Math.floor((screenY - this.offsetY) / this.cellSize);
        return { x: gridX, y: gridY };
    }

    /**
     * 网格坐标转换为屏幕坐标
     */
    gridToScreen(gridX, gridY) {
        const screenX = gridX * this.cellSize + this.offsetX;
        const screenY = gridY * this.cellSize + this.offsetY;
        return { x: screenX, y: screenY };
    }

    /**
     * 获取格子中心的屏幕坐标
     */
    getCellCenter(gridX, gridY) {
        const screen = this.gridToScreen(gridX, gridY);
        return {
            x: screen.x + this.cellSize / 2,
            y: screen.y + this.cellSize / 2
        };
    }

    /**
     * 检查坐标是否在网格范围内
     */
    isValidCoordinate(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    /**
     * 在指定位置种植
     */
    plantAt(gridX, gridY, plant) {
        const cell = this.getCell(gridX, gridY);
        if (cell && cell.canPlant()) {
            return cell.plantSeed(plant);
        }
        return false;
    }

    /**
     * 在指定位置浇水
     */
    waterAt(gridX, gridY) {
        const cell = this.getCell(gridX, gridY);
        if (cell) {
            cell.water();
            return true;
        }
        return false;
    }

    /**
     * 在指定位置收获
     */
    harvestAt(gridX, gridY) {
        const cell = this.getCell(gridX, gridY);
        if (cell) {
            return cell.harvest();
        }
        return null;
    }

    /**
     * 更新所有格子
     */
    update(deltaTime) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.cells[y][x].update(deltaTime);
            }
        }
    }

    /**
     * 设置渲染偏移，用于居中显示
     */
    setOffset(offsetX, offsetY) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    /**
     * 计算网格总尺寸
     */
    getTotalSize() {
        return {
            width: this.width * this.cellSize,
            height: this.height * this.cellSize
        };
    }

    /**
     * 获取所有需要浇水的格子
     */
    getCellsNeedingWater() {
        const needWater = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.cells[y][x];
                if (cell.needsWater()) {
                    needWater.push({ x, y, cell });
                }
            }
        }
        return needWater;
    }

    /**
     * 获取所有可收获的格子
     */
    getHarvestableCells() {
        const harvestable = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.cells[y][x];
                if (cell.plant && cell.plant.canHarvest()) {
                    harvestable.push({ x, y, cell });
                }
            }
        }
        return harvestable;
    }

    /**
     * 序列化网格状态用于保存
     */
    serialize() {
        const cellsData = [];
        for (let y = 0; y < this.height; y++) {
            cellsData[y] = [];
            for (let x = 0; x < this.width; x++) {
                const cell = this.cells[y][x];
                cellsData[y][x] = {
                    soilMoisture: cell.soilMoisture,
                    lastWatered: cell.lastWatered,
                    isEmpty: cell.isEmpty,
                    plant: cell.plant ? cell.plant.serialize() : null
                };
            }
        }
        
        return {
            width: this.width,
            height: this.height,
            cellSize: this.cellSize,
            cells: cellsData
        };
    }

    /**
     * 从序列化数据恢复网格状态
     */
    deserialize(data) {
        this.width = data.width;
        this.height = data.height;
        this.cellSize = data.cellSize;
        
        this.initializeGrid();
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (data.cells[y] && data.cells[y][x]) {
                    const cellData = data.cells[y][x];
                    const cell = this.cells[y][x];
                    
                    cell.soilMoisture = cellData.soilMoisture;
                    cell.lastWatered = cellData.lastWatered;
                    cell.isEmpty = cellData.isEmpty;
                    
                    if (cellData.plant) {
                        // 反序列化植物数据
                        if (typeof Plant !== 'undefined') {
                            cell.plant = Plant.deserialize(cellData.plant);
                        }
                    }
                }
            }
        }
    }
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GardenGrid, GardenCell };
}