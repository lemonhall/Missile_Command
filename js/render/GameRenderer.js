// 主渲染器协调类
class GameRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
        this.time = 0; // 用于动画效果
        
        // 初始化各个渲染模块
        this.backgroundRenderer = new BackgroundRenderer(canvas, ctx);
        this.objectRenderer = new ObjectRenderer(canvas, ctx);
        this.missileRenderer = new MissileRenderer(canvas, ctx);
        this.effectRenderer = new EffectRenderer(canvas, ctx);
        this.uiRenderer = new UIRenderer(canvas, ctx);
    }
    
    update(deltaTime) {
        this.time += deltaTime * 0.001; // 转换为秒
    }
    
    clearCanvas(level = 1) {
        this.backgroundRenderer.clearCanvas(level, this.time);
    }
    
    drawStars(level = 1) {
        this.backgroundRenderer.drawStars(level, this.time);
    }
    
    drawGround(groundLevel, level = 1) {
        this.backgroundRenderer.drawGround(groundLevel, level);
    }

    
    drawCities(cities, level = 1) {
        this.objectRenderer.drawCities(cities, level, this.time);
    }
    
    drawLaunchPad(launchPad) {
        this.objectRenderer.drawLaunchPad(launchPad, this.time);
    }
    
    drawPlayerMissiles(missiles) {
        this.missileRenderer.drawPlayerMissiles(missiles, this.time);
    }
    
    drawEnemyMissiles(missiles) {
        this.missileRenderer.drawEnemyMissiles(missiles, this.time);
    }
    
    drawExplosions(explosions) {
        this.effectRenderer.drawExplosions(explosions, this.time);
    }
    
    drawParticles(particles) {
        this.effectRenderer.drawParticles(particles);
    }
    
    drawLevelCompleteMessage() {
        this.uiRenderer.drawLevelCompleteMessage();
    }
    
    drawGameInfo(enemyMissilesSpawned, enemyMissilesToSpawn, enemyMissilesOnScreen) {
        this.uiRenderer.drawGameInfo(enemyMissilesSpawned, enemyMissilesToSpawn, enemyMissilesOnScreen);
    }
    
    drawPauseScreen() {
        this.uiRenderer.drawPauseScreen();
    }
    
    drawCityName(level) {
        this.uiRenderer.drawCityName(level);
    }
} 