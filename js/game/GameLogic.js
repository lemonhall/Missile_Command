// 游戏逻辑更新模块
class GameLogic {
    constructor(game) {
        this.game = game;
    }
    
    update(deltaTime) {
        // 更新导弹
        this.game.missileManager.updateMissiles(deltaTime);
        
        // 更新爆炸
        this.game.explosions = this.game.explosions.filter(explosion => explosion.update(deltaTime));
        
        // 更新粒子
        this.game.particles = this.game.particles.filter(particle => particle.update(deltaTime));
        
        // 碰撞检测
        this.checkCollisions();
        
        // 检查游戏结束条件
        if (this.game.citiesRemaining <= 0) {
            this.game.gameOver();
        }
        
        // 检查关卡完成 - 添加防重复触发机制
        if (this.game.enemyMissilesSpawned >= this.game.enemyMissilesToSpawn && 
            this.game.enemyMissiles.length === 0 && 
            this.game.gameState === 'playing' &&
            !this.game.levelCompleting) {
            this.game.levelCompleting = true; // 设置标志防止重复触发
            setTimeout(() => {
                if (this.game.enemyMissiles.length === 0 && this.game.gameState === 'playing') {
                    this.game.nextLevel();
                }
            }, GameConfig.LEVEL_COMPLETE_DELAY);
        }
    }
    
    checkCollisions() {
        this.game.explosions.forEach(explosion => {
            if (explosion.type !== 'player') return;
            
            this.game.enemyMissiles = this.game.enemyMissiles.filter(missile => {
                const dx = missile.x - explosion.x;
                const dy = missile.y - explosion.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < explosion.radius) {
                    this.game.score += GameConfig.SCORE_PER_ENEMY_MISSILE;
                    this.game.createExplosion(missile.x, missile.y, 'chain');
                    this.game.updateUI();
                    return false;
                }
                return true;
            });
        });
    }
    
    checkCityHit(x, y) {
        this.game.cities.forEach(city => {
            if (city.isHit(x, y)) {
                city.destroy();
                this.game.citiesRemaining--;
                this.game.updateUI();
                
                // 播放城市被摧毁音效
                if (window.AudioManager) {
                    window.AudioManager.playSound('cityDestroyed');
                }
            }
        });
    }
    
    createExplosion(x, y, type) {
        const explosion = new Explosion(x, y, type);
        this.game.explosions.push(explosion);
        
        // 创建粒子效果
        for (let i = 0; i < GameConfig.PARTICLE_COUNT_PER_EXPLOSION; i++) {
            this.game.particles.push(new Particle(x, y, type));
        }
        
        // 根据爆炸类型播放不同的音效
        if (window.AudioManager) {
            if (type === 'chain') {
                window.AudioManager.playSound('chainExplosion');
            } else {
                window.AudioManager.playSound('explosion');
            }
        }
    }
} 