# 设计文档

## 概述

Grow Garden小游戏是一个基于HTML5 Canvas的互动园艺游戏，将通过iframe嵌入到现有的首页中。游戏采用模块化设计，包含游戏引擎、状态管理、渲染系统和用户交互系统。游戏将替换或补充现有的第三方游戏iframe，提供原生的、可控的游戏体验。

## 架构

### 整体架构
```
┌─────────────────────────────────────┐
│           主页面 (Next.js)           │
│  ┌─────────────────────────────────┐ │
│  │        游戏 iframe              │ │
│  │  ┌─────────────────────────────┐│ │
│  │  │      游戏应用 (HTML5)       ││ │
│  │  │  ┌─────────────────────────┐││ │
│  │  │  │    游戏引擎 (Canvas)    │││ │
│  │  │  └─────────────────────────┘││ │
│  │  └─────────────────────────────┘│ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 技术栈
- **前端框架**: 纯HTML5 + JavaScript (ES6+)
- **渲染引擎**: HTML5 Canvas API
- **状态管理**: 自定义状态管理器
- **数据持久化**: localStorage
- **动画系统**: requestAnimationFrame
- **资源管理**: 图片预加载和缓存

## 组件和接口

### 1. 游戏引擎核心 (GameEngine)
```typescript
interface GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  gameState: GameState;
  
  init(): void;
  update(deltaTime: number): void;
  render(): void;
  handleInput(event: InputEvent): void;
}
```

### 2. 游戏状态管理 (GameState)
```typescript
interface GameState {
  garden: GardenGrid;
  player: PlayerData;
  gameTime: number;
  
  save(): void;
  load(): GameState | null;
  reset(): void;
}

interface GardenGrid {
  width: number;
  height: number;
  cells: GardenCell[][];
}

interface GardenCell {
  plant: Plant | null;
  soilMoisture: number;
  lastWatered: number;
}
```

### 3. 植物系统 (Plant)
```typescript
interface Plant {
  id: string;
  type: PlantType;
  stage: GrowthStage;
  plantedTime: number;
  lastWatered: number;
  health: number;
  
  update(deltaTime: number): void;
  needsWater(): boolean;
  canHarvest(): boolean;
}

enum PlantType {
  FLOWER = 'flower',
  VEGETABLE = 'vegetable',
  TREE = 'tree'
}

enum GrowthStage {
  SEED = 0,
  SPROUT = 1,
  YOUNG = 2,
  MATURE = 3,
  READY = 4
}
```

### 4. 渲染系统 (Renderer)
```typescript
interface Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  
  renderGarden(garden: GardenGrid): void;
  renderPlant(plant: Plant, x: number, y: number): void;
  renderUI(gameState: GameState): void;
  renderEffects(effects: Effect[]): void;
}
```

### 5. 输入处理 (InputHandler)
```typescript
interface InputHandler {
  selectedTool: GameTool;
  selectedPlantType: PlantType;
  
  handleClick(x: number, y: number): void;
  handleToolSelect(tool: GameTool): void;
  handlePlantSelect(plantType: PlantType): void;
}

enum GameTool {
  PLANT = 'plant',
  WATER = 'water',
  HARVEST = 'harvest'
}
```

## 数据模型

### 游戏配置
```typescript
interface GameConfig {
  gridSize: { width: number; height: number };
  cellSize: number;
  plantGrowthTimes: Record<PlantType, number[]>;
  wateringInterval: number;
  harvestRewards: Record<PlantType, number>;
}
```

### 玩家数据
```typescript
interface PlayerData {
  score: number;
  plantsHarvested: number;
  totalPlayTime: number;
  achievements: string[];
}
```

### 视觉资源
```typescript
interface GameAssets {
  sprites: {
    soil: HTMLImageElement;
    plants: Record<PlantType, Record<GrowthStage, HTMLImageElement>>;
    tools: Record<GameTool, HTMLImageElement>;
    effects: Record<string, HTMLImageElement>;
  };
  
  loadAssets(): Promise<void>;
}
```

## 错误处理

### 1. 资源加载错误
- 实现资源加载重试机制
- 提供默认占位符图像
- 显示友好的错误提示

### 2. 存储错误
- localStorage不可用时的降级处理
- 数据损坏时的恢复机制
- 存储空间不足的处理

### 3. 渲染错误
- Canvas不支持时的降级方案
- 性能不足时的优化策略
- 响应式布局适配问题

### 4. 游戏逻辑错误
- 无效操作的拦截和提示
- 状态不一致的修复机制
- 时间计算错误的处理

## 测试策略

### 1. 单元测试
- 植物成长逻辑测试
- 状态管理功能测试
- 工具函数测试
- 数据持久化测试

### 2. 集成测试
- 游戏引擎初始化测试
- 用户交互流程测试
- 渲染系统集成测试
- iframe嵌入测试

### 3. 性能测试
- Canvas渲染性能测试
- 内存使用监控
- 移动设备兼容性测试
- 长时间运行稳定性测试

### 4. 用户体验测试
- 响应式设计测试
- 触摸设备交互测试
- 游戏平衡性测试
- 可访问性测试

## 文件结构

```
public/
├── game/
│   ├── index.html              # 游戏主页面
│   ├── game.js                 # 游戏主逻辑
│   ├── engine/
│   │   ├── GameEngine.js       # 游戏引擎
│   │   ├── Renderer.js         # 渲染系统
│   │   ├── InputHandler.js     # 输入处理
│   │   └── StateManager.js     # 状态管理
│   ├── entities/
│   │   ├── Plant.js            # 植物类
│   │   └── Garden.js           # 花园类
│   ├── assets/
│   │   ├── sprites/            # 游戏精灵图
│   │   └── sounds/             # 音效文件
│   └── styles/
│       └── game.css            # 游戏样式
```

## 性能优化

### 1. 渲染优化
- 使用离屏Canvas进行预渲染
- 实现脏矩形更新机制
- 优化动画帧率控制
- 图像资源压缩和缓存

### 2. 内存管理
- 及时清理不用的对象引用
- 使用对象池管理频繁创建的对象
- 优化图像资源的内存占用
- 实现垃圾回收友好的代码结构

### 3. 响应式设计
- 实现Canvas自适应缩放
- 优化触摸设备的交互体验
- 支持不同屏幕尺寸的布局调整
- 提供高DPI屏幕的支持

## 集成方案

### 1. iframe集成
- 创建独立的游戏HTML页面
- 通过postMessage与父页面通信
- 实现游戏尺寸的动态调整
- 处理跨域安全问题

### 2. 现有页面集成
- 替换现有的GameIframe组件源
- 保持现有的样式和布局结构
- 确保与现有导航和页脚的兼容性
- 维护SEO友好的页面结构