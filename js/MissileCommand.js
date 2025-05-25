// 主要游戏逻辑类
class MissileCommand {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // 初始化渲染器
        this.renderer = new GameRenderer(this.canvas, this.ctx);
        
        // 游戏状态
        this.gameState = 'waiting'; // waiting, playing, paused, gameOver
        this.score = 0;
        this.level = 1;
        
        // 游戏对象
        this.cities = [];
        this.missiles = [];
        this.enemyMissiles = [];
        this.explosions = [];
        this.particles = [];
        
        // 游戏设置
        this.groundLevel = this.height - GameConfig.GROUND_LEVEL_OFFSET;
        this.launchPad = new LaunchPad(this.width / 2, this.groundLevel);
        this.citiesRemaining = GameConfig.CITY_COUNT;
        this.enemyMissilesToSpawn = GameConfig.ENEMY_MISSILE_BASE_COUNT;
        this.enemyMissilesSpawned = 0;
        
        // 控制变量
        this.lastTime = 0;
        this.animationId = null;
        this.spawnTimer = null;
        this.levelCompleting = false; // 防止重复触发关卡完成
        
        this.init();
        this.bindEvents();
    }
    
    init() {
        // 创建城市
        this.cities = [];
        const citySpacing = (this.width - GameConfig.CITY_COUNT * GameConfig.CITY_WIDTH) / (GameConfig.CITY_COUNT + 1);
        
        for (let i = 0; i < GameConfig.CITY_COUNT; i++) {
            this.cities.push(new City(
                citySpacing + i * (GameConfig.CITY_WIDTH + citySpacing),
                this.groundLevel - GameConfig.CITY_HEIGHT,
                GameConfig.CITY_WIDTH,
                GameConfig.CITY_HEIGHT
            ));
        }
        
        this.citiesRemaining = GameConfig.CITY_COUNT;
        this.enemyMissilesToSpawn = GameConfig.ENEMY_MISSILE_BASE_COUNT + this.level * GameConfig.ENEMY_MISSILE_COUNT_INCREMENT;
        this.enemyMissilesSpawned = 0;
        this.levelCompleting = false; // 重置关卡完成标志
        this.updateUI();
    }
    
    bindEvents() {
        // 鼠标点击发射导弹
        this.canvas.addEventListener('click', (e) => {
            if (this.gameState === 'playing') {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.fireMissile(x, y);
            }
        });
        
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePause();
                    break;
                case 'KeyR':
                    this.restart();
                    break;
            }
        });
        
        // 按钮事件
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.restart());
    }
    
    async start() {
        this.gameState = 'playing';
        this.gameLoop();
        this.spawnEnemyMissiles();
        
        // 确保音频系统初始化后再播放背景音乐
        if (window.AudioManager) {
            await window.AudioManager.initAudioContext();
            setTimeout(() => {
                window.AudioManager.playBGM('music/Untitled.mp3');
            }, 100); // 稍微延迟确保初始化完成
        }
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            cancelAnimationFrame(this.animationId);
            if (this.spawnTimer) {
                clearTimeout(this.spawnTimer);
                this.spawnTimer = null;
            }
            
            // 暂停背景音乐
            if (window.AudioManager) {
                window.AudioManager.pauseBGM();
            }
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.gameLoop();
            this.spawnEnemyMissiles();
            
            // 恢复背景音乐
            if (window.AudioManager) {
                window.AudioManager.resumeBGM();
            }
        }
    }
    
    restart() {
        this.gameState = 'waiting';
        this.score = 0;
        this.level = 1;
        this.missiles = [];
        this.enemyMissiles = [];
        this.explosions = [];
        this.particles = [];
        this.levelCompleting = false; // 重置关卡完成标志
        cancelAnimationFrame(this.animationId);
        if (this.spawnTimer) {
            clearTimeout(this.spawnTimer);
            this.spawnTimer = null;
        }
        
        // 停止背景音乐
        if (window.AudioManager) {
            window.AudioManager.stopBGM();
        }
        
        this.init();
        document.getElementById('gameOverScreen').classList.add('hidden');
    }
    
    fireMissile(targetX, targetY) {
        // 限制导弹数量
        if (this.missiles.length >= GameConfig.PLAYER_MISSILE_LIMIT) return;
        
        const missile = new Missile(
            this.launchPad.x, 
            this.launchPad.y, 
            targetX, 
            targetY, 
            GameConfig.PLAYER_MISSILE_SPEED
        );
        
        this.missiles.push(missile);
        
        // 播放发射音效
        if (window.AudioManager) {
            window.AudioManager.playSound('missileLaunch');
        }
    }
    
    spawnEnemyMissiles() {
        if (this.gameState !== 'playing' || this.enemyMissilesSpawned >= this.enemyMissilesToSpawn) {
            return;
        }
        
        const spawnRate = Math.max(
            GameConfig.ENEMY_SPAWN_BASE_RATE - this.level * GameConfig.ENEMY_SPAWN_RATE_DECREMENT, 
            GameConfig.ENEMY_SPAWN_MIN_RATE
        );
        
        this.spawnTimer = setTimeout(() => {
            if (this.gameState === 'playing' && this.enemyMissilesSpawned < this.enemyMissilesToSpawn) {
                this.createEnemyMissile();
                this.enemyMissilesSpawned++;
                this.spawnEnemyMissiles();
            }
        }, spawnRate + Math.random() * GameConfig.ENEMY_SPAWN_RANDOM_DELAY);
    }
    
    createEnemyMissile() {
        const startX = Math.random() * this.width;
        const aliveCities = this.cities.filter(city => city.alive);
        const targets = [...aliveCities, this.launchPad];
        const target = targets[Math.floor(Math.random() * targets.length)];
        
        if (!target) return;
        
        const targetX = target.x + (target.width || 0) / 2;
        const targetY = target.y || this.groundLevel;
        const speed = GameConfig.ENEMY_MISSILE_BASE_SPEED + this.level * GameConfig.ENEMY_MISSILE_SPEED_INCREMENT;
        
        const missile = new Missile(startX, 0, targetX, targetY, speed);
        this.enemyMissiles.push(missile);
    }
    
    update(deltaTime) {
        // 更新玩家导弹
        this.missiles = this.missiles.filter(missile => {
            missile.update(deltaTime, GameConfig.PLAYER_MISSILE_TRAIL_LENGTH);
            
            if (missile.hasReachedTarget()) {
                this.createExplosion(missile.x, missile.y, 'player');
                return false;
            }
            return true;
        });
        
        // 更新敌方导弹
        this.enemyMissiles = this.enemyMissiles.filter(missile => {
            missile.update(deltaTime, GameConfig.ENEMY_MISSILE_TRAIL_LENGTH);
            
            if (missile.y >= missile.targetY) {
                this.createExplosion(missile.x, missile.y, 'enemy');
                this.checkCityHit(missile.x, missile.y);
                return false;
            }
            return true;
        });
        
        // 更新爆炸
        this.explosions = this.explosions.filter(explosion => explosion.update(deltaTime));
        
        // 更新粒子
        this.particles = this.particles.filter(particle => particle.update(deltaTime));
        
        // 碰撞检测
        this.checkCollisions();
        
        // 检查游戏结束条件
        if (this.citiesRemaining <= 0) {
            this.gameOver();
        }
        
        // 检查关卡完成 - 添加防重复触发机制
        if (this.enemyMissilesSpawned >= this.enemyMissilesToSpawn && 
            this.enemyMissiles.length === 0 && 
            this.gameState === 'playing' &&
            !this.levelCompleting) {
            this.levelCompleting = true; // 设置标志防止重复触发
            setTimeout(() => {
                if (this.enemyMissiles.length === 0 && this.gameState === 'playing') {
                    this.nextLevel();
                }
            }, GameConfig.LEVEL_COMPLETE_DELAY);
        }
    }
    
    checkCollisions() {
        this.explosions.forEach(explosion => {
            if (explosion.type !== 'player') return;
            
            this.enemyMissiles = this.enemyMissiles.filter(missile => {
                const dx = missile.x - explosion.x;
                const dy = missile.y - explosion.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < explosion.radius) {
                    this.score += GameConfig.SCORE_PER_ENEMY_MISSILE;
                    this.createExplosion(missile.x, missile.y, 'chain');
                    this.updateUI();
                    return false;
                }
                return true;
            });
        });
    }
    
    checkCityHit(x, y) {
        this.cities.forEach(city => {
            if (city.isHit(x, y)) {
                city.destroy();
                this.citiesRemaining--;
                this.updateUI();
                
                // 播放城市被摧毁音效
                if (window.AudioManager) {
                    window.AudioManager.playSound('cityDestroyed');
                }
            }
        });
    }
    
    createExplosion(x, y, type) {
        const explosion = new Explosion(x, y, type);
        this.explosions.push(explosion);
        
        // 创建粒子效果
        for (let i = 0; i < GameConfig.PARTICLE_COUNT_PER_EXPLOSION; i++) {
            this.particles.push(new Particle(x, y, type));
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
    
    nextLevel() {
        this.level++;
        this.score += this.citiesRemaining * GameConfig.SCORE_PER_CITY_BONUS;
        this.updateUI();
        
        // 播放关卡完成音效
        if (window.AudioManager) {
            window.AudioManager.playSound('levelComplete');
        }
        
        // 稍微修复一些城市
        if (this.citiesRemaining < GameConfig.CITY_COUNT) {
            const deadCities = this.cities.filter(city => !city.alive);
            if (deadCities.length > 0) {
                const cityToRepair = deadCities[Math.floor(Math.random() * deadCities.length)];
                cityToRepair.repair();
                this.citiesRemaining++;
            }
        }
        
        // 重新初始化关卡
        this.enemyMissilesToSpawn = GameConfig.ENEMY_MISSILE_BASE_COUNT + this.level * GameConfig.ENEMY_MISSILE_COUNT_INCREMENT;
        this.enemyMissilesSpawned = 0;
        this.levelCompleting = false; // 重置关卡完成标志，准备下一关
        this.updateUI();
        
        // 延迟开始新关卡
        setTimeout(() => {
            if (this.gameState === 'playing') {
                this.spawnEnemyMissiles();
            }
        }, GameConfig.NEXT_LEVEL_START_DELAY);
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        cancelAnimationFrame(this.animationId);
        if (this.spawnTimer) {
            clearTimeout(this.spawnTimer);
            this.spawnTimer = null;
        }
        
        // 停止背景音乐
        if (window.AudioManager) {
            window.AudioManager.stopBGM();
        }
        
        // 播放游戏结束音效
        if (window.AudioManager) {
            window.AudioManager.playSound('gameOver');
        }
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('cities').textContent = this.citiesRemaining;
    }
    
    render() {
        // 更新渲染器时间
        this.renderer.update(this.lastTime);
        
        // 清空画布
        this.renderer.clearCanvas();
        
        // 绘制星空背景
        this.renderer.drawStars();
        
        // 绘制地面
        this.renderer.drawGround(this.groundLevel);
        
        // 绘制城市
        this.renderer.drawCities(this.cities);
        
        // 绘制发射台
        this.renderer.drawLaunchPad(this.launchPad);
        
        // 绘制导弹
        this.renderer.drawPlayerMissiles(this.missiles);
        this.renderer.drawEnemyMissiles(this.enemyMissiles);
        
        // 绘制爆炸
        this.renderer.drawExplosions(this.explosions);
        
        // 绘制粒子
        this.renderer.drawParticles(this.particles);
        
        // 绘制关卡信息
        if (this.enemyMissilesSpawned >= this.enemyMissilesToSpawn && 
            this.enemyMissiles.length === 0 && 
            this.gameState === 'playing') {
            this.renderer.drawLevelCompleteMessage();
        }
        
        // 绘制游戏信息
        if (this.gameState === 'playing') {
            this.renderer.drawGameInfo(
                this.enemyMissilesSpawned, 
                this.enemyMissilesToSpawn, 
                this.enemyMissiles.length
            );
        }
        
        // 绘制暂停信息
        if (this.gameState === 'paused') {
            this.renderer.drawPauseScreen();
        }
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        if (this.gameState === 'playing') {
            this.update(deltaTime);
        }
        
        this.render();
        
        if (this.gameState !== 'gameOver') {
            this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
        }
    }
} 