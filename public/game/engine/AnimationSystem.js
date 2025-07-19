/**
 * AnimationSystem - 动画和特效系统
 * 负责管理游戏中的各种动画效果
 */

class AnimationSystem {
    constructor() {
        this.activeAnimations = new Map();
        this.animationId = 0;
        this.gameContainer = null;
        
        // 动画配置
        this.config = {
            // 植物成长动画配置
            plantGrowth: {
                duration: 1500,
                easing: 'ease-out'
            },
            // 浇水动画配置
            watering: {
                duration: 1000,
                rippleCount: 3,
                rippleDelay: 200
            },
            // 收获动画配置
            harvest: {
                duration: 2000,
                particleCount: 8,
                burstDuration: 800
            },
            // 种植动画配置
            planting: {
                duration: 1000,
                soilDigDuration: 800
            }
        };
        
        // 绑定方法
        this.cleanup = this.cleanup.bind(this);
    }
    
    /**
     * 初始化动画系统
     */
    init(gameContainer) {
        this.gameContainer = gameContainer || document.getElementById('game-container');
        if (!this.gameContainer) {
            console.warn('游戏容器未找到，动画系统可能无法正常工作');
        }
        
        console.log('动画系统初始化完成');
    }
    
    /**
     * 播放植物成长动画
     */
    playPlantGrowthAnimation(element, stage) {
        if (!element) return null;
        
        const animationId = this.generateAnimationId();
        
        // 移除之前的成长动画
        element.classList.remove('plant-growing');
        
        // 强制重排以确保类被移除
        element.offsetHeight;
        
        // 添加成长动画类
        element.classList.add('plant-growing');
        
        // 根据成长阶段调整动画
        const duration = this.config.plantGrowth.duration;
        const scaleMultiplier = this.getGrowthScaleMultiplier(stage);
        
        // 自定义动画样式
        if (scaleMultiplier !== 1) {
            const customStyle = document.createElement('style');
            customStyle.textContent = `
                .plant-growing-${animationId} {
                    animation: plantGrowth${animationId} ${duration}ms ease-out;
                }
                @keyframes plantGrowth${animationId} {
                    0% { transform: scale(0.8); opacity: 0.8; }
                    50% { transform: scale(${1.1 * scaleMultiplier}); opacity: 1; }
                    100% { transform: scale(${scaleMultiplier}); opacity: 1; }
                }
            `;
            document.head.appendChild(customStyle);
            
            element.classList.add(`plant-growing-${animationId}`);
            
            // 清理自定义样式
            setTimeout(() => {
                element.classList.remove(`plant-growing-${animationId}`);
                document.head.removeChild(customStyle);
            }, duration);
        }
        
        // 清理动画类
        setTimeout(() => {
            element.classList.remove('plant-growing');
            this.removeAnimation(animationId);
        }, duration);
        
        this.activeAnimations.set(animationId, {
            type: 'plantGrowth',
            element,
            startTime: Date.now(),
            duration
        });
        
        return animationId;
    }
    
    /**
     * 播放浇水动画效果
     */
    playWateringAnimation(x, y, targetElement = null) {
        const animationId = this.generateAnimationId();
        
        // 创建浇水滴落效果
        this.createWaterDropEffect(x, y);
        
        // 创建波纹效果
        this.createWaterRipples(x, y);
        
        // 如果有目标元素，添加土壤湿润效果
        if (targetElement) {
            this.applySoilWateredEffect(targetElement);
        }
        
        this.activeAnimations.set(animationId, {
            type: 'watering',
            x, y,
            startTime: Date.now(),
            duration: this.config.watering.duration
        });
        
        return animationId;
    }
    
    /**
     * 播放收获动画效果
     */
    playHarvestAnimation(x, y, plant, reward, targetElement = null) {
        const animationId = this.generateAnimationId();
        
        // 创建收获爆炸效果
        if (targetElement) {
            this.createHarvestBurst(targetElement);
        }
        
        // 创建粒子效果
        this.createHarvestParticles(x, y, plant.type);
        
        // 创建奖励显示
        this.createRewardDisplay(x, y, reward);
        
        // 创建收获指示器消失效果
        this.createHarvestIndicatorFade(x, y);
        
        this.activeAnimations.set(animationId, {
            type: 'harvest',
            x, y, plant, reward,
            startTime: Date.now(),
            duration: this.config.harvest.duration
        });
        
        return animationId;
    }
    
    /**
     * 播放种植动画效果
     */
    playPlantingAnimation(x, y, plantType, targetElement = null) {
        const animationId = this.generateAnimationId();
        
        // 创建土壤挖掘效果
        if (targetElement) {
            this.applySoilDigEffect(targetElement);
        }
        
        // 创建种植弹出效果
        this.createPlantingPopEffect(x, y, plantType);
        
        // 创建种子埋入效果
        this.createSeedBuryEffect(x, y);
        
        this.activeAnimations.set(animationId, {
            type: 'planting',
            x, y, plantType,
            startTime: Date.now(),
            duration: this.config.planting.duration
        });
        
        return animationId;
    }
    
    /**
     * 播放UI反馈动画
     */
    playUIFeedbackAnimation(element, type, data = {}) {
        if (!element) return null;
        
        const animationId = this.generateAnimationId();
        
        switch (type) {
            case 'scoreIncrease':
                this.playScoreIncreaseAnimation(element, data.amount);
                break;
            case 'levelUp':
                this.playLevelUpAnimation(element, data.newLevel);
                break;
            case 'toolSelect':
                this.playToolSelectAnimation(element, data.enhanced);
                break;
            case 'plantSelect':
                this.playPlantSelectAnimation(element);
                break;
            case 'successFlash':
                this.playSuccessFlashAnimation(element);
                break;
            case 'errorShake':
                this.playErrorShakeAnimation(element);
                break;
            default:
                console.warn(`未知的UI动画类型: ${type}`);
                return null;
        }
        
        this.activeAnimations.set(animationId, {
            type: `ui_${type}`,
            element,
            startTime: Date.now(),
            duration: 1000 // 默认UI动画持续时间
        });
        
        return animationId;
    }
    
    /**
     * 创建水滴效果
     */
    createWaterDropEffect(x, y) {
        const dropElement = document.createElement('div');
        dropElement.className = 'watering-effect';
        dropElement.textContent = '💧';
        dropElement.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: 20px;
            pointer-events: none;
            z-index: 999;
            animation: wateringDrop 1s ease-out forwards;
        `;
        
        if (this.gameContainer) {
            this.gameContainer.appendChild(dropElement);
            
            setTimeout(() => {
                if (dropElement.parentNode) {
                    dropElement.parentNode.removeChild(dropElement);
                }
            }, 1000);
        }
    }
    
    /**
     * 创建水波纹效果
     */
    createWaterRipples(x, y) {
        const rippleCount = this.config.watering.rippleCount;
        const rippleDelay = this.config.watering.rippleDelay;
        
        for (let i = 0; i < rippleCount; i++) {
            setTimeout(() => {
                this.createSingleRipple(x, y, i);
            }, i * rippleDelay);
        }
    }
    
    /**
     * 创建单个波纹
     */
    createSingleRipple(x, y, index) {
        const ripple = document.createElement('div');
        ripple.className = 'water-ripple';
        ripple.style.cssText = `
            position: absolute;
            left: ${x - 10}px;
            top: ${y - 10}px;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(33, 150, 243, ${0.8 - index * 0.2});
            border-radius: 50%;
            animation: waterRipple 1s ease-out forwards;
            animation-delay: ${index * 0.1}s;
            pointer-events: none;
            z-index: 998;
        `;
        
        if (this.gameContainer) {
            this.gameContainer.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 1000 + index * 100);
        }
    }
    
    /**
     * 应用土壤湿润效果
     */
    applySoilWateredEffect(element) {
        element.classList.add('soil-watered');
        
        setTimeout(() => {
            element.classList.remove('soil-watered');
        }, 2000);
    }
    
    /**
     * 创建收获爆炸效果
     */
    createHarvestBurst(element) {
        element.classList.add('harvest-burst');
        
        setTimeout(() => {
            element.classList.remove('harvest-burst');
        }, this.config.harvest.burstDuration);
    }
    
    /**
     * 创建收获粒子效果
     */
    createHarvestParticles(x, y, plantType) {
        const particleColors = {
            'flower': ['#FF69B4', '#FFD700', '#FF1493', '#DDA0DD'],
            'vegetable': ['#32CD32', '#FF6347', '#90EE90', '#FFA500'],
            'tree': ['#228B22', '#8B4513', '#32CD32', '#654321']
        };
        
        const colors = particleColors[plantType] || particleColors['flower'];
        const particleCount = this.config.harvest.particleCount;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                this.createHarvestParticle(x, y, colors[i % colors.length], i);
            }, i * 50);
        }
    }
    
    /**
     * 创建单个收获粒子
     */
    createHarvestParticle(x, y, color, index) {
        const particle = document.createElement('div');
        particle.className = 'harvest-particle';
        
        // 随机方向和距离
        const angle = (Math.PI * 2 * index / 8) + (Math.random() - 0.5) * 0.5;
        const distance = 30 + Math.random() * 40;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;
        
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
            box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
            animation: particleFloat 1.5s ease-out forwards;
            --end-x: ${endX}px;
            --end-y: ${endY}px;
        `;
        
        if (this.gameContainer) {
            this.gameContainer.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1500);
        }
    }
    
    /**
     * 创建奖励显示
     */
    createRewardDisplay(x, y, reward) {
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
        
        if (this.gameContainer) {
            this.gameContainer.appendChild(rewardElement);
            
            setTimeout(() => {
                if (rewardElement.parentNode) {
                    rewardElement.parentNode.removeChild(rewardElement);
                }
            }, 2000);
        }
    }
    
    /**
     * 创建收获指示器消失效果
     */
    createHarvestIndicatorFade(x, y) {
        // 这个效果主要通过渲染器处理
        // 这里可以添加额外的视觉效果
        console.log(`收获指示器消失效果在 (${x}, ${y})`);
    }
    
    /**
     * 应用土壤挖掘效果
     */
    applySoilDigEffect(element) {
        element.classList.add('soil-dig');
        
        setTimeout(() => {
            element.classList.remove('soil-dig');
        }, this.config.planting.soilDigDuration);
    }
    
    /**
     * 创建种植弹出效果
     */
    createPlantingPopEffect(x, y, plantType) {
        const plantIcons = {
            'flower': '🌸',
            'vegetable': '🥕',
            'tree': '🌳'
        };
        
        const icon = plantIcons[plantType] || '🌱';
        
        const effect = document.createElement('div');
        effect.className = 'planting-effect';
        effect.textContent = icon;
        effect.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: 24px;
            pointer-events: none;
            z-index: 999;
            animation: plantingPop 1s ease-out forwards;
            transform: translate(-50%, -50%);
        `;
        
        if (this.gameContainer) {
            this.gameContainer.appendChild(effect);
            
            setTimeout(() => {
                if (effect.parentNode) {
                    effect.parentNode.removeChild(effect);
                }
            }, 1000);
        }
    }
    
    /**
     * 创建种子埋入效果
     */
    createSeedBuryEffect(x, y) {
        const seedEffect = document.createElement('div');
        seedEffect.textContent = '🌰';
        seedEffect.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: 16px;
            pointer-events: none;
            z-index: 998;
            transform: translate(-50%, -50%);
            animation: seedBury 0.8s ease-in forwards;
        `;
        
        // 添加种子埋入动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes seedBury {
                0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -30%) scale(0.5); }
            }
        `;
        document.head.appendChild(style);
        
        if (this.gameContainer) {
            this.gameContainer.appendChild(seedEffect);
            
            setTimeout(() => {
                if (seedEffect.parentNode) {
                    seedEffect.parentNode.removeChild(seedEffect);
                }
                document.head.removeChild(style);
            }, 800);
        }
    }
    
    /**
     * 播放积分增加动画
     */
    playScoreIncreaseAnimation(element, amount) {
        element.classList.add('score-increase');
        
        setTimeout(() => {
            element.classList.remove('score-increase');
        }, 600);
    }
    
    /**
     * 播放等级提升动画
     */
    playLevelUpAnimation(element, newLevel) {
        element.classList.add('level-up');
        
        // 创建等级提升通知
        this.createLevelUpNotification(newLevel);
        
        setTimeout(() => {
            element.classList.remove('level-up');
        }, 1500);
    }
    
    /**
     * 创建等级提升通知
     */
    createLevelUpNotification(newLevel) {
        const notification = document.createElement('div');
        notification.textContent = `等级提升！现在是等级 ${newLevel}`;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #FFD700, #FFA500);
            color: white;
            padding: 16px 32px;
            border-radius: 8px;
            font-size: 18px;
            font-weight: bold;
            z-index: 10001;
            box-shadow: 0 4px 20px rgba(255, 215, 0, 0.5);
            animation: levelUpNotification 3s ease-out forwards;
        `;
        
        // 添加等级提升通知动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes levelUpNotification {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            document.head.removeChild(style);
        }, 3000);
    }
    
    /**
     * 播放工具选择动画
     */
    playToolSelectAnimation(element, enhanced = false) {
        const animationClass = enhanced ? 'tool-selected-enhanced' : 'tool-selected';
        element.classList.add(animationClass);
        
        const duration = enhanced ? 400 : 200;
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, duration);
    }
    
    /**
     * 播放植物选择动画
     */
    playPlantSelectAnimation(element) {
        element.classList.add('plant-selected');
        
        setTimeout(() => {
            element.classList.remove('plant-selected');
        }, 300);
    }
    
    /**
     * 播放成功闪光动画
     */
    playSuccessFlashAnimation(element) {
        element.classList.add('success-flash');
        
        setTimeout(() => {
            element.classList.remove('success-flash');
        }, 600);
    }
    
    /**
     * 播放错误震动动画
     */
    playErrorShakeAnimation(element) {
        element.classList.add('error-shake');
        
        setTimeout(() => {
            element.classList.remove('error-shake');
        }, 500);
    }
    
    /**
     * 获取成长阶段的缩放倍数
     */
    getGrowthScaleMultiplier(stage) {
        const scaleMap = {
            0: 0.6,  // 种子
            1: 0.8,  // 幼苗
            2: 1.0,  // 成长
            3: 1.2,  // 成熟
            4: 1.4   // 可收获
        };
        
        return scaleMap[stage] || 1.0;
    }
    
    /**
     * 生成动画ID
     */
    generateAnimationId() {
        return ++this.animationId;
    }
    
    /**
     * 移除动画
     */
    removeAnimation(animationId) {
        this.activeAnimations.delete(animationId);
    }
    
    /**
     * 停止指定动画
     */
    stopAnimation(animationId) {
        const animation = this.activeAnimations.get(animationId);
        if (animation) {
            // 根据动画类型进行清理
            if (animation.element) {
                // 移除所有可能的动画类
                const animationClasses = [
                    'plant-growing', 'soil-watered', 'soil-dig', 'harvest-burst',
                    'score-increase', 'level-up', 'tool-selected', 'tool-selected-enhanced',
                    'plant-selected', 'success-flash', 'error-shake'
                ];
                
                animationClasses.forEach(className => {
                    animation.element.classList.remove(className);
                });
            }
            
            this.removeAnimation(animationId);
        }
    }
    
    /**
     * 停止所有动画
     */
    stopAllAnimations() {
        this.activeAnimations.forEach((animation, id) => {
            this.stopAnimation(id);
        });
    }
    
    /**
     * 获取活动动画数量
     */
    getActiveAnimationCount() {
        return this.activeAnimations.size;
    }
    
    /**
     * 清理过期动画
     */
    cleanup() {
        const now = Date.now();
        const expiredAnimations = [];
        
        this.activeAnimations.forEach((animation, id) => {
            if (now - animation.startTime > animation.duration + 1000) {
                expiredAnimations.push(id);
            }
        });
        
        expiredAnimations.forEach(id => {
            this.removeAnimation(id);
        });
    }
    
    /**
     * 重置动画系统
     */
    reset() {
        console.log('重置动画系统');
        
        // 停止所有动画
        this.stopAllAnimations();
        
        // 清空动画映射
        this.activeAnimations.clear();
        
        // 重置动画ID计数器
        this.animationId = 0;
        
        console.log('动画系统重置完成');
    }
    
    /**
     * 销毁动画系统
     */
    destroy() {
        this.stopAllAnimations();
        this.activeAnimations.clear();
        this.gameContainer = null;
        
        console.log('动画系统已销毁');
    }
}

// 导出类（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationSystem;
}