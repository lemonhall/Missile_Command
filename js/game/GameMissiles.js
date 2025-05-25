// 导弹管理模块
class GameMissiles {
    constructor(game) {
        this.game = game;
    }
    
    fireMissile(targetX, targetY) {
        // 限制导弹数量
        if (this.game.missiles.length >= GameConfig.PLAYER_MISSILE_LIMIT) return;
        
        const missile = new Missile(
            this.game.launchPad.x, 
            this.game.launchPad.y, 
            targetX, 
            targetY, 
            GameConfig.PLAYER_MISSILE_SPEED
        );
        
        this.game.missiles.push(missile);
        
        // 播放发射音效
        if (window.AudioManager) {
            window.AudioManager.playSound('missileLaunch');
        }
    }
    
    spawnEnemyMissiles() {
        if (this.game.gameState !== 'playing' || this.game.enemyMissilesSpawned >= this.game.enemyMissilesToSpawn) {
            return;
        }
        
        const spawnRate = Math.max(
            GameConfig.ENEMY_SPAWN_BASE_RATE - this.game.level * GameConfig.ENEMY_SPAWN_RATE_DECREMENT, 
            GameConfig.ENEMY_SPAWN_MIN_RATE
        );
        
        this.game.spawnTimer = setTimeout(() => {
            if (this.game.gameState === 'playing' && this.game.enemyMissilesSpawned < this.game.enemyMissilesToSpawn) {
                this.createEnemyMissile();
                this.game.enemyMissilesSpawned++;
                this.spawnEnemyMissiles();
            }
        }, spawnRate + Math.random() * GameConfig.ENEMY_SPAWN_RANDOM_DELAY);
    }
    
    createEnemyMissile() {
        const startX = Math.random() * this.game.width;
        const aliveCities = this.game.cities.filter(city => city.alive);
        const targets = [...aliveCities, this.game.launchPad];
        const target = targets[Math.floor(Math.random() * targets.length)];
        
        if (!target) return;
        
        const targetX = target.x + (target.width || 0) / 2;
        const targetY = target.y || this.game.groundLevel;
        // 应用导弹速度上限
        const speed = Math.min(
            GameConfig.ENEMY_MISSILE_BASE_SPEED + this.game.level * GameConfig.ENEMY_MISSILE_SPEED_INCREMENT,
            GameConfig.ENEMY_MISSILE_MAX_SPEED
        );
        
        const missile = new Missile(startX, 0, targetX, targetY, speed);
        this.game.enemyMissiles.push(missile);
    }
    
    updateMissiles(deltaTime) {
        // 更新玩家导弹
        this.game.missiles = this.game.missiles.filter(missile => {
            missile.update(deltaTime, GameConfig.PLAYER_MISSILE_TRAIL_LENGTH);
            
            if (missile.hasReachedTarget()) {
                this.game.logic.createExplosion(missile.x, missile.y, 'player');
                return false;
            }
            return true;
        });
        
        // 更新敌方导弹
        this.game.enemyMissiles = this.game.enemyMissiles.filter(missile => {
            missile.update(deltaTime, GameConfig.ENEMY_MISSILE_TRAIL_LENGTH);
            
            if (missile.y >= missile.targetY) {
                this.game.logic.createExplosion(missile.x, missile.y, 'enemy');
                this.game.logic.checkCityHit(missile.x, missile.y);
                return false;
            }
            return true;
        });
    }
}