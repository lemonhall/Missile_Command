// 主要游戏协调器类 - 模块化重构后
class MissileCommand extends GameCore {
    constructor() {
        super();
        
        // 初始化游戏模块
        this.events = new GameEvents(this);
        this.missileManager = new GameMissiles(this);
        this.logic = new GameLogic(this);
        this.levelManager = new GameLevel(this);
        
        this.init();
        this.events.bindEvents();
    }
    
    // 委托给相应模块的方法
    fireMissile(targetX, targetY) {
        this.missileManager.fireMissile(targetX, targetY);
    }
    
    spawnEnemyMissiles() {
        this.missileManager.spawnEnemyMissiles();
    }
    
    async start() {
        await this.levelManager.start();
    }
    
    togglePause() {
        this.levelManager.togglePause();
    }
    
    restart() {
        this.levelManager.restart();
    }
    
    nextLevel() {
        this.levelManager.nextLevel();
    }
    
    gameOver() {
        this.levelManager.gameOver();
    }
    
    update(deltaTime) {
        this.logic.update(deltaTime);
    }
    
    checkCityHit(x, y) {
        this.logic.checkCityHit(x, y);
    }
    
    createExplosion(x, y, type) {
        this.logic.createExplosion(x, y, type);
    }
} 