// 关卡和状态管理模块
class GameLevel {
    constructor(game) {
        this.game = game;
    }
    
    async start() {
        this.game.gameState = 'playing';
        this.game.gameLoop();
        this.game.missileManager.spawnEnemyMissiles();
        
        // 确保音频系统初始化后再播放背景音乐
        if (window.AudioManager) {
            await window.AudioManager.initAudioContext();
            setTimeout(() => {
                window.AudioManager.playBGM('music/Untitled.mp3');
            }, 100); // 稍微延迟确保初始化完成
        }
    }
    
    togglePause() {
        if (this.game.gameState === 'playing') {
            this.game.gameState = 'paused';
            cancelAnimationFrame(this.game.animationId);
            if (this.game.spawnTimer) {
                clearTimeout(this.game.spawnTimer);
                this.game.spawnTimer = null;
            }
            
            // 暂停背景音乐
            if (window.AudioManager) {
                window.AudioManager.pauseBGM();
            }
        } else if (this.game.gameState === 'paused') {
            this.game.gameState = 'playing';
            this.game.gameLoop();
            this.game.missileManager.spawnEnemyMissiles();
            
            // 恢复背景音乐
            if (window.AudioManager) {
                window.AudioManager.resumeBGM();
            }
        }
    }
    
    restart() {
        this.game.gameState = 'waiting';
        this.game.score = 0;
        this.game.level = 1;
        this.game.missiles = [];
        this.game.enemyMissiles = [];
        this.game.explosions = [];
        this.game.particles = [];
        this.game.levelCompleting = false; // 重置关卡完成标志
        cancelAnimationFrame(this.game.animationId);
        if (this.game.spawnTimer) {
            clearTimeout(this.game.spawnTimer);
            this.game.spawnTimer = null;
        }
        
        // 停止背景音乐
        if (window.AudioManager) {
            window.AudioManager.stopBGM();
        }
        
        this.game.init();
        document.getElementById('gameOverScreen').classList.add('hidden');
    }
    
    nextLevel() {
        this.game.level++;
        this.game.score += this.game.citiesRemaining * GameConfig.SCORE_PER_CITY_BONUS;
        this.game.updateUI();
        
        // 播放关卡完成音效
        if (window.AudioManager) {
            window.AudioManager.playSound('levelComplete');
        }
        
        // 稍微修复一些城市
        if (this.game.citiesRemaining < GameConfig.CITY_COUNT) {
            const deadCities = this.game.cities.filter(city => !city.alive);
            if (deadCities.length > 0) {
                const cityToRepair = deadCities[Math.floor(Math.random() * deadCities.length)];
                cityToRepair.repair();
                this.game.citiesRemaining++;
            }
        }
        
        // 重新初始化关卡
        this.game.enemyMissilesToSpawn = Math.min(
            GameConfig.ENEMY_MISSILE_BASE_COUNT + this.game.level * GameConfig.ENEMY_MISSILE_COUNT_INCREMENT,
            GameConfig.ENEMY_MISSILE_MAX_COUNT
        );
        this.game.enemyMissilesSpawned = 0;
        this.game.levelCompleting = false; // 重置关卡完成标志，准备下一关
        this.game.updateUI();
        
        // 延迟开始新关卡
        setTimeout(() => {
            if (this.game.gameState === 'playing') {
                this.game.missileManager.spawnEnemyMissiles();
            }
        }, GameConfig.NEXT_LEVEL_START_DELAY);
    }
    
    gameOver() {
        this.game.gameState = 'gameOver';
        cancelAnimationFrame(this.game.animationId);
        if (this.game.spawnTimer) {
            clearTimeout(this.game.spawnTimer);
            this.game.spawnTimer = null;
        }
        
        // 停止背景音乐
        if (window.AudioManager) {
            window.AudioManager.stopBGM();
        }
        
        // 播放游戏结束音效
        if (window.AudioManager) {
            window.AudioManager.playSound('gameOver');
        }
        
        document.getElementById('finalScore').textContent = this.game.score;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }
    
    // 作弊器：直接跳到下一关
    cheatNextLevel() {
        if (this.game.gameState !== 'playing') {
            return;
        }
        
        // 清除所有敌方导弹和爆炸
        this.game.enemyMissiles = [];
        this.game.explosions = [];
        this.game.particles = [];
        
        // 清除当前的敌方导弹生成计时器
        if (this.game.spawnTimer) {
            clearTimeout(this.game.spawnTimer);
            this.game.spawnTimer = null;
        }
        
        // 重置敌方导弹计数器，模拟全部击毁
        this.game.enemyMissilesSpawned = this.game.enemyMissilesToSpawn;
        
        // 标记关卡完成
        this.game.levelCompleting = true;
        
        // 播放关卡完成音效
        if (window.AudioManager) {
            window.AudioManager.playSound('levelComplete');
        }
        
        // 延迟进入下一关
        setTimeout(() => {
            this.nextLevel();
        }, 1000);
    }
} 