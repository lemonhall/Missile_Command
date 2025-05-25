// 游戏核心类
class GameCore {
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
        this.enemyMissilesToSpawn = Math.min(
            GameConfig.ENEMY_MISSILE_BASE_COUNT + this.level * GameConfig.ENEMY_MISSILE_COUNT_INCREMENT,
            GameConfig.ENEMY_MISSILE_MAX_COUNT
        );
        this.enemyMissilesSpawned = 0;
        
        // 控制变量
        this.lastTime = 0;
        this.animationId = null;
        this.spawnTimer = null;
        this.levelCompleting = false; // 防止重复触发关卡完成
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
        this.enemyMissilesToSpawn = Math.min(
            GameConfig.ENEMY_MISSILE_BASE_COUNT + this.level * GameConfig.ENEMY_MISSILE_COUNT_INCREMENT,
            GameConfig.ENEMY_MISSILE_MAX_COUNT
        );
        this.enemyMissilesSpawned = 0;
        this.levelCompleting = false; // 重置关卡完成标志
        this.updateUI();
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('cities').textContent = this.citiesRemaining;
        
        // 作弊按钮始终显示（方便测试城市风格）
    }
    
    render() {
        // 更新渲染器时间
        this.renderer.update(this.lastTime);
        
        // 清空画布，传入当前关卡
        this.renderer.clearCanvas(this.level);
        
        // 绘制星空背景，传入当前关卡
        this.renderer.drawStars(this.level);
        
        // 绘制地面
        this.renderer.drawGround(this.groundLevel, this.level);
        
        // 绘制城市
        this.renderer.drawCities(this.cities, this.level);
        
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
            
            // 绘制城市名称
            this.renderer.drawCityName(this.level);
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