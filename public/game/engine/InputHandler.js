/**
 * InputHandler - 输入处理系统
 * 负责处理用户输入事件
 */

class InputHandler {
    constructor(canvas) {
        this.canvas = canvas;
        this.gameEngine = null;
        
        // 输入状态
        this.selectedTool = 'plant';
        this.selectedPlantType = 'flower';
        this.isMouseDown = false;
        this.lastClickTime = 0;
        this.doubleClickDelay = 300;
        
        // 触摸支持
        this.touchStartTime = 0;
        this.touchMoved = false;
        
        // 悬停状态
        this.hoveredGridX = -1;
        this.hoveredGridY = -1;
        this.lastHoverTime = 0;
        
        // 绑定事件处理器
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);
        
        // 设置事件监听器
        this.setupEventListeners();
    }
    
    /**
     * 设置游戏引擎引用
     */
    setGameEngine(gameEngine) {
        this.gameEngine = gameEngine;
    }
    
    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 鼠标事件
        this.canvas.addEventListener('click', this.handleClick);
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('contextmenu', this.handleContextMenu);
        
        // 触摸事件
        this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchEnd, { passive: false });
        
        // 键盘事件（全局）
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }
    
    /**
     * 更新输入状态
     */
    update(deltaTime) {
        // 输入状态更新逻辑
        // 后续任务会扩展
    }
    
    /**
     * 处理鼠标点击
     */
    handleClick(event) {
        event.preventDefault();
        
        const coords = this.getCanvasCoordinates(event);
        const currentTime = Date.now();
        
        // 检测双击
        const isDoubleClick = (currentTime - this.lastClickTime) < this.doubleClickDelay;
        this.lastClickTime = currentTime;
        
        console.log(`Canvas点击: (${coords.x}, ${coords.y}), 工具: ${this.selectedTool}, 双击: ${isDoubleClick}`);
        
        // 处理点击操作
        this.processClick(coords.x, coords.y, isDoubleClick);
    }
    
    /**
     * 处理鼠标按下
     */
    handleMouseDown(event) {
        this.isMouseDown = true;
        const coords = this.getCanvasCoordinates(event);
        console.log(`鼠标按下: (${coords.x}, ${coords.y})`);
    }
    
    /**
     * 处理鼠标释放
     */
    handleMouseUp(event) {
        this.isMouseDown = false;
        const coords = this.getCanvasCoordinates(event);
        console.log(`鼠标释放: (${coords.x}, ${coords.y})`);
    }
    
    /**
     * 处理鼠标移动
     */
    handleMouseMove(event) {
        const coords = this.getCanvasCoordinates(event);
        
        // 更新鼠标悬停状态
        this.updateHoverState(coords.x, coords.y);
        
        if (!this.isMouseDown) return;
        
        // 拖拽操作处理
        // 后续任务会扩展
    }
    
    /**
     * 处理触摸开始
     */
    handleTouchStart(event) {
        event.preventDefault();
        
        if (event.touches.length === 1) {
            this.touchStartTime = Date.now();
            this.touchMoved = false;
            
            const touch = event.touches[0];
            const coords = this.getTouchCoordinates(touch);
            console.log(`触摸开始: (${coords.x}, ${coords.y})`);
        }
    }
    
    /**
     * 处理触摸移动
     */
    handleTouchMove(event) {
        event.preventDefault();
        this.touchMoved = true;
    }
    
    /**
     * 处理触摸结束
     */
    handleTouchEnd(event) {
        event.preventDefault();
        
        if (event.changedTouches.length === 1 && !this.touchMoved) {
            const touch = event.changedTouches[0];
            const coords = this.getTouchCoordinates(touch);
            
            // 将触摸转换为点击事件
            console.log(`触摸点击: (${coords.x}, ${coords.y})`);
            this.processClick(coords.x, coords.y, false);
        }
    }
    
    /**
     * 处理右键菜单
     */
    handleContextMenu(event) {
        event.preventDefault();
        return false;
    }
    
    /**
     * 处理键盘按下
     */
    handleKeyDown(event) {
        // 防止在输入框中触发快捷键
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (event.key) {
            case '1':
                event.preventDefault();
                this.setSelectedTool('plant');
                break;
            case '2':
                event.preventDefault();
                this.setSelectedTool('water');
                break;
            case '3':
                event.preventDefault();
                this.setSelectedTool('harvest');
                break;
            case 'q':
            case 'Q':
                if (this.selectedTool === 'plant') {
                    event.preventDefault();
                    this.setSelectedPlantType('flower');
                }
                break;
            case 'w':
            case 'W':
                if (this.selectedTool === 'plant') {
                    event.preventDefault();
                    this.setSelectedPlantType('vegetable');
                }
                break;
            case 'e':
            case 'E':
                if (this.selectedTool === 'plant') {
                    event.preventDefault();
                    this.setSelectedPlantType('tree');
                }
                break;
            case 'Escape':
                event.preventDefault();
                this.resetSelection();
                break;
        }
    }
    
    /**
     * 处理键盘释放
     */
    handleKeyUp(event) {
        // 键盘释放处理
        // 后续任务会扩展
    }
    
    /**
     * 处理点击操作
     */
    processClick(x, y, isDoubleClick) {
        if (!this.gameEngine) return;
        
        const renderer = this.gameEngine.getRenderer();
        const gameState = this.gameEngine.getGameState();
        if (!renderer || !gameState) return;
        
        // 获取网格坐标
        const gridCoords = renderer.getGridCoordinates(x, y, gameState.garden);
        
        console.log(`网格坐标: (${gridCoords.x}, ${gridCoords.y})`);
        
        // 根据选择的工具执行操作
        switch (this.selectedTool) {
            case 'plant':
                this.handlePlantAction(gridCoords.x, gridCoords.y);
                break;
            case 'water':
                this.handleWaterAction(gridCoords.x, gridCoords.y);
                break;
            case 'harvest':
                this.handleHarvestAction(gridCoords.x, gridCoords.y);
                break;
        }
    }
    
    /**
     * 处理种植操作
     */
    handlePlantAction(gridX, gridY) {
        console.log(`尝试种植 ${this.selectedPlantType} 在 (${gridX}, ${gridY})`);
        
        if (!this.gameEngine) {
            this.showActionFeedback('游戏引擎未初始化', 'error');
            return;
        }
        
        const gameState = this.gameEngine.getGameState();
        if (!gameState) {
            this.showActionFeedback('游戏状态未初始化', 'error');
            return;
        }
        
        // 验证种植条件
        const validationResult = this.validatePlantingConditions(gridX, gridY, gameState);
        if (!validationResult.valid) {
            this.showActionFeedback(validationResult.message, 'warning');
            return;
        }
        
        // 尝试种植
        const success = gameState.plantSeed(gridX, gridY, this.selectedPlantType);
        
        if (success) {
            const plantNames = {
                'flower': '花朵',
                'vegetable': '蔬菜',
                'tree': '树木'
            };
            const plantName = plantNames[this.selectedPlantType] || this.selectedPlantType;
            this.showActionFeedback(`成功种植${plantName}！`, 'success');
            console.log(`成功种植 ${this.selectedPlantType} 在 (${gridX}, ${gridY})`);
            
            // 播放种植动画效果
            this.playPlantingEffect(gridX, gridY);
        } else {
            this.showActionFeedback('种植失败，请重试', 'error');
            console.log(`种植失败在 (${gridX}, ${gridY})`);
        }
    }
    
    /**
     * 处理浇水操作
     */
    handleWaterAction(gridX, gridY) {
        console.log(`浇水在 (${gridX}, ${gridY})`);
        
        if (!this.gameEngine) {
            this.showActionFeedback('游戏引擎未初始化', 'error');
            return;
        }
        
        const gameState = this.gameEngine.getGameState();
        if (!gameState) {
            this.showActionFeedback('游戏状态未初始化', 'error');
            return;
        }
        
        // 验证浇水条件
        const validationResult = this.validateWateringConditions(gridX, gridY, gameState);
        if (!validationResult.valid) {
            this.showActionFeedback(validationResult.message, 'warning');
            return;
        }
        
        // 尝试浇水
        const success = gameState.waterPlant(gridX, gridY);
        
        if (success) {
            const cell = gameState.getCell(gridX, gridY);
            if (cell && cell.plant) {
                this.showActionFeedback(`为${cell.plant.getDisplayName()}浇水成功！`, 'success');
            } else {
                this.showActionFeedback('土壤浇水成功！', 'success');
            }
            console.log(`成功浇水在 (${gridX}, ${gridY})`);
            
            // 播放浇水动画效果
            this.playWateringEffect(gridX, gridY);
        } else {
            this.showActionFeedback('浇水失败，请重试', 'error');
            console.log(`浇水失败在 (${gridX}, ${gridY})`);
        }
    }
    
    /**
     * 处理收获操作
     */
    handleHarvestAction(gridX, gridY) {
        console.log(`收获在 (${gridX}, ${gridY})`);
        
        if (!this.gameEngine) {
            this.showActionFeedback('游戏引擎未初始化', 'error');
            return;
        }
        
        const gameState = this.gameEngine.getGameState();
        if (!gameState) {
            this.showActionFeedback('游戏状态未初始化', 'error');
            return;
        }
        
        // 验证收获条件
        const validationResult = this.validateHarvestConditions(gridX, gridY, gameState);
        if (!validationResult.valid) {
            this.showActionFeedback(validationResult.message, 'warning');
            return;
        }
        
        // 获取植物信息用于动画和奖励显示
        const cell = gameState.getCell(gridX, gridY);
        const plant = cell.plant;
        const plantName = plant.getDisplayName();
        const expectedReward = plant.getHarvestReward();
        
        // 尝试收获
        const result = gameState.harvestPlant(gridX, gridY);
        
        if (result) {
            const actualReward = result.reward;
            this.showActionFeedback(`成功收获${plantName}！获得 ${actualReward} 积分`, 'success');
            console.log(`成功收获植物，获得 ${actualReward} 积分`);
            
            // 播放收获动画效果
            this.playHarvestEffect(gridX, gridY, plant, actualReward);
            
            // 更新UI显示
            this.updateScoreDisplay(gameState.getPlayer().score);
            this.updatePlantsCountDisplay(gameState.getPlayer().plantsHarvested);
        } else {
            this.showActionFeedback('收获失败，请重试', 'error');
            console.log(`收获失败在 (${gridX}, ${gridY})`);
        }
    }
    
    /**
     * 获取Canvas坐标
     */
    getCanvasCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
    
    /**
     * 获取触摸坐标
     */
    getTouchCoordinates(touch) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    }
    
    /**
     * 设置选择的工具
     */
    setSelectedTool(tool) {
        const previousTool = this.selectedTool;
        this.selectedTool = tool;
        console.log(`切换工具: ${previousTool} -> ${tool}`);
        
        // 更新UI按钮状态
        this.updateToolButtons();
        
        // 提供视觉反馈
        this.showToolFeedback(tool);
        
        // 重置光标样式
        this.canvas.style.cursor = 'default';
    }
    
    /**
     * 设置选择的植物类型
     */
    setSelectedPlantType(plantType) {
        this.selectedPlantType = plantType;
        console.log(`切换植物类型: ${plantType}`);
        
        // 更新UI按钮状态
        this.updatePlantButtons();
    }
    
    /**
     * 更新工具按钮状态
     */
    updateToolButtons() {
        const toolButtons = document.querySelectorAll('.tool-btn');
        toolButtons.forEach(btn => {
            const isActive = btn.dataset.tool === this.selectedTool;
            btn.classList.toggle('active', isActive);
        });
        
        // 根据选择的工具显示/隐藏植物选择器
        this.updatePlantSelectorVisibility();
    }
    
    /**
     * 更新植物按钮状态
     */
    updatePlantButtons() {
        const plantButtons = document.querySelectorAll('.plant-btn');
        plantButtons.forEach(btn => {
            const isActive = btn.dataset.plant === this.selectedPlantType;
            btn.classList.toggle('active', isActive);
        });
    }
    
    /**
     * 更新植物选择器可见性
     */
    updatePlantSelectorVisibility() {
        const plantSelector = document.getElementById('plant-selector');
        if (plantSelector) {
            // 只有在种植工具选中时才显示植物选择器
            const shouldShow = this.selectedTool === 'plant';
            plantSelector.style.display = shouldShow ? 'flex' : 'none';
        }
    }
    
    /**
     * 更新悬停状态
     */
    updateHoverState(canvasX, canvasY) {
        if (!this.gameEngine) return;
        
        const renderer = this.gameEngine.getRenderer();
        const gameState = this.gameEngine.getGameState();
        if (!renderer || !gameState) return;
        
        // 获取网格坐标
        const gridCoords = renderer.getGridCoordinates(canvasX, canvasY, gameState.garden);
        
        // 检查是否悬停在新的格子上
        if (gridCoords.x !== this.hoveredGridX || gridCoords.y !== this.hoveredGridY) {
            this.hoveredGridX = gridCoords.x;
            this.hoveredGridY = gridCoords.y;
            this.lastHoverTime = Date.now();
            
            // 更新光标样式
            this.updateCursor(gridCoords.x, gridCoords.y);
        }
    }
    
    /**
     * 更新光标样式
     */
    updateCursor(gridX, gridY) {
        if (!this.gameEngine) return;
        
        const gameState = this.gameEngine.getGameState();
        if (!gameState) return;
        
        let cursor = 'default';
        
        // 检查网格坐标是否有效
        if (gridX >= 0 && gridY >= 0 && gridX < gameState.garden.width && gridY < gameState.garden.height) {
            const cell = gameState.garden.cells[gridY][gridX];
            
            switch (this.selectedTool) {
                case 'plant':
                    cursor = cell.plant ? 'not-allowed' : 'crosshair';
                    break;
                case 'water':
                    cursor = cell.plant ? 'pointer' : 'not-allowed';
                    break;
                case 'harvest':
                    cursor = (cell.plant && cell.plant.canHarvest()) ? 'grab' : 'not-allowed';
                    break;
                default:
                    cursor = 'pointer';
            }
        }
        
        this.canvas.style.cursor = cursor;
    }
    
    /**
     * 获取悬停的网格坐标
     */
    getHoveredGridCoords() {
        return {
            x: this.hoveredGridX,
            y: this.hoveredGridY
        };
    }
    
    /**
     * 显示工具切换反馈
     */
    showToolFeedback(tool) {
        // 获取工具按钮元素
        const toolBtn = document.querySelector(`[data-tool="${tool}"]`);
        if (!toolBtn) return;
        
        // 添加反馈动画类
        toolBtn.classList.add('tool-selected');
        
        // 移除动画类
        setTimeout(() => {
            toolBtn.classList.remove('tool-selected');
        }, 200);
        
        // 在控制台显示工具提示
        const toolNames = {
            'plant': '种植工具',
            'water': '浇水工具', 
            'harvest': '收获工具'
        };
        
        console.log(`已选择: ${toolNames[tool] || tool}`);
    }
    
    /**
     * 获取当前选择的工具
     */
    getSelectedTool() {
        return this.selectedTool;
    }
    
    /**
     * 获取当前选择的植物类型
     */
    getSelectedPlantType() {
        return this.selectedPlantType;
    }
    
    /**
     * 重置选择状态
     */
    resetSelection() {
        // 重置为默认工具和植物类型
        this.setSelectedTool('plant');
        this.setSelectedPlantType('flower');
        
        // 重置悬停状态
        this.hoveredGridX = -1;
        this.hoveredGridY = -1;
        this.canvas.style.cursor = 'default';
        
        console.log('已重置选择状态');
    }
    
    /**
     * 验证收获条件
     */
    validateHarvestConditions(gridX, gridY, gameState) {
        // 检查坐标是否有效
        if (!gameState.isValidCoordinate(gridX, gridY)) {
            return { valid: false, message: '无效的位置' };
        }
        
        const cell = gameState.getCell(gridX, gridY);
        if (!cell) {
            return { valid: false, message: '无法获取格子信息' };
        }
        
        // 检查是否有植物
        if (!cell.plant) {
            return { valid: false, message: '这里没有植物可以收获' };
        }
        
        // 检查植物是否可以收获
        if (!cell.plant.canHarvest()) {
            const stageName = cell.plant.getStageName();
            return { valid: false, message: `植物还未成熟，当前阶段：${stageName}` };
        }
        
        return { valid: true, message: '可以收获' };
    }
    
    /**
     * 验证种植条件
     */
    validatePlantingConditions(gridX, gridY, gameState) {
        // 检查坐标是否有效
        if (!gameState.isValidCoordinate(gridX, gridY)) {
            return { valid: false, message: '无效的位置' };
        }
        
        const cell = gameState.getCell(gridX, gridY);
        if (!cell) {
            return { valid: false, message: '无法获取格子信息' };
        }
        
        // 检查是否已有植物
        if (cell.plant) {
            return { valid: false, message: '这里已经有植物了' };
        }
        
        return { valid: true, message: '可以种植' };
    }
    
    /**
     * 验证浇水条件
     */
    validateWateringConditions(gridX, gridY, gameState) {
        // 检查坐标是否有效
        if (!gameState.isValidCoordinate(gridX, gridY)) {
            return { valid: false, message: '无效的位置' };
        }
        
        const cell = gameState.getCell(gridX, gridY);
        if (!cell) {
            return { valid: false, message: '无法获取格子信息' };
        }
        
        // 可以为空土壤或有植物的土壤浇水
        return { valid: true, message: '可以浇水' };
    }
    
    /**
     * 播放收获动画效果
     */
    playHarvestEffect(gridX, gridY, plant, reward) {
        if (!this.gameEngine) return;
        
        const renderer = this.gameEngine.getRenderer();
        const animationSystem = this.gameEngine.getAnimationSystem();
        if (!renderer || !animationSystem) return;
        
        // 获取屏幕坐标
        const screenCoords = renderer.getScreenCoordinates(gridX, gridY);
        
        // 使用动画系统播放收获动画
        animationSystem.playHarvestAnimation(screenCoords.x, screenCoords.y, plant, reward);
        
        console.log(`播放收获动画在 (${gridX}, ${gridY})，奖励: ${reward}`);
    }
    
    /**
     * 播放种植动画效果
     */
    playPlantingEffect(gridX, gridY) {
        if (!this.gameEngine) return;
        
        const renderer = this.gameEngine.getRenderer();
        const animationSystem = this.gameEngine.getAnimationSystem();
        if (!renderer || !animationSystem) return;
        
        // 获取屏幕坐标
        const screenCoords = renderer.getScreenCoordinates(gridX, gridY);
        
        // 使用动画系统播放种植动画
        animationSystem.playPlantingAnimation(screenCoords.x, screenCoords.y, this.selectedPlantType);
        
        console.log(`播放种植动画在 (${gridX}, ${gridY})`);
    }
    
    /**
     * 播放浇水动画效果
     */
    playWateringEffect(gridX, gridY) {
        if (!this.gameEngine) return;
        
        const renderer = this.gameEngine.getRenderer();
        const animationSystem = this.gameEngine.getAnimationSystem();
        if (!renderer || !animationSystem) return;
        
        // 获取屏幕坐标
        const screenCoords = renderer.getScreenCoordinates(gridX, gridY);
        
        // 使用动画系统播放浇水动画
        animationSystem.playWateringAnimation(screenCoords.x, screenCoords.y);
        
        console.log(`播放浇水动画在 (${gridX}, ${gridY})`);
    }
    
    /**
     * 创建收获动画
     */
    createHarvestAnimation(x, y, plant, reward) {
        // 创建收获粒子效果
        this.createHarvestParticles(x, y, plant.type);
        
        // 创建植物消失动画
        this.createPlantDisappearAnimation(x, y);
    }
    
    /**
     * 创建奖励显示动画
     */
    createRewardAnimation(x, y, reward) {
        // 创建奖励文本元素
        const rewardElement = document.createElement('div');
        rewardElement.className = 'reward-animation';
        rewardElement.textContent = `+${reward}`;
        rewardElement.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            color: #FFD700;
            font-size: 20px;
            font-weight: bold;
            pointer-events: none;
            z-index: 1000;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            animation: rewardFloat 2s ease-out forwards;
        `;
        
        // 添加到游戏容器
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.appendChild(rewardElement);
            
            // 2秒后移除元素
            setTimeout(() => {
                if (rewardElement.parentNode) {
                    rewardElement.parentNode.removeChild(rewardElement);
                }
            }, 2000);
        }
    }
    
    /**
     * 创建收获粒子效果
     */
    createHarvestParticles(x, y, plantType) {
        // 根据植物类型选择粒子颜色
        const particleColors = {
            'flower': ['#FF69B4', '#FFD700', '#FF1493'],
            'vegetable': ['#32CD32', '#FF6347', '#90EE90'],
            'tree': ['#228B22', '#8B4513', '#32CD32']
        };
        
        const colors = particleColors[plantType] || particleColors['flower'];
        
        // 创建多个粒子
        for (let i = 0; i < 8; i++) {
            this.createParticle(x, y, colors[i % colors.length]);
        }
    }
    
    /**
     * 创建单个粒子
     */
    createParticle(x, y, color) {
        const particle = document.createElement('div');
        particle.className = 'harvest-particle';
        
        // 随机方向和距离
        const angle = (Math.PI * 2 * Math.random());
        const distance = 30 + Math.random() * 40;
        const endX = x + Math.cos(angle) * distance;
        const endY = y + Math.sin(angle) * distance;
        
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 6px;
            height: 6px;
            background-color: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
            animation: particleFloat 1.5s ease-out forwards;
            --end-x: ${endX}px;
            --end-y: ${endY}px;
        `;
        
        // 添加到游戏容器
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.appendChild(particle);
            
            // 1.5秒后移除粒子
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1500);
        }
    }
    
    /**
     * 创建植物消失动画
     */
    createPlantDisappearAnimation(x, y) {
        // 这个动画主要通过渲染器处理
        // 这里可以添加额外的视觉效果
        console.log(`植物消失动画在 (${x}, ${y})`);
    }
    
    /**
     * 创建种植动画
     */
    createPlantingAnimation(x, y) {
        // 创建种植效果
        const effect = document.createElement('div');
        effect.className = 'planting-effect';
        effect.textContent = '🌱';
        effect.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: 24px;
            pointer-events: none;
            z-index: 999;
            animation: plantingPop 1s ease-out forwards;
        `;
        
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.appendChild(effect);
            
            setTimeout(() => {
                if (effect.parentNode) {
                    effect.parentNode.removeChild(effect);
                }
            }, 1000);
        }
    }
    
    /**
     * 创建浇水动画
     */
    createWateringAnimation(x, y) {
        // 创建浇水效果
        const effect = document.createElement('div');
        effect.className = 'watering-effect';
        effect.textContent = '💧';
        effect.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: 20px;
            pointer-events: none;
            z-index: 999;
            animation: wateringDrop 1s ease-out forwards;
        `;
        
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.appendChild(effect);
            
            setTimeout(() => {
                if (effect.parentNode) {
                    effect.parentNode.removeChild(effect);
                }
            }, 1000);
        }
    }
    
    /**
     * 显示操作反馈
     */
    showActionFeedback(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // 创建反馈元素
        const feedback = document.createElement('div');
        feedback.className = `action-feedback ${type}`;
        feedback.textContent = message;
        
        // 设置样式
        const colors = {
            'success': '#4CAF50',
            'error': '#F44336',
            'warning': '#FF9800',
            'info': '#2196F3'
        };
        
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: ${colors[type] || colors.info};
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            animation: feedbackSlide 3s ease-out forwards;
        `;
        
        document.body.appendChild(feedback);
        
        // 3秒后移除反馈
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 3000);
    }
    
    /**
     * 更新积分显示
     */
    updateScoreDisplay(score) {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = `积分: ${score}`;
        }
    }
    
    /**
     * 更新植物数量显示
     */
    updatePlantsCountDisplay(plantsHarvested) {
        const plantsElement = document.getElementById('plants-count');
        if (plantsElement) {
            plantsElement.textContent = `收获: ${plantsHarvested}`;
        }
    }
    
    /**
     * 销毁输入处理器
     */
    destroy() {
        // 移除事件监听器
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('contextmenu', this.handleContextMenu);
        
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        this.canvas.removeEventListener('touchmove', this.handleTouchMove);
        this.canvas.removeEventListener('touchend', this.handleTouchEnd);
        
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        
        console.log('输入处理器已销毁');
    }
}

// 导出类（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputHandler;
}