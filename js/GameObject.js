// 游戏对象类定义

class Missile {
    constructor(x, y, targetX, targetY, speed) {
        this.x = x;
        this.y = y;
        this.startX = x;  // 添加起始位置
        this.startY = y;  // 添加起始位置
        this.targetX = targetX;
        this.targetY = targetY;
        this.trail = [];
        
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.vx = (dx / distance) * speed;
        this.vy = (dy / distance) * speed;
    }
    
    update(deltaTime, maxTrailLength) {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > maxTrailLength) {
            this.trail.shift();
        }
        
        this.x += this.vx * deltaTime / 1000;
        this.y += this.vy * deltaTime / 1000;
    }
    
    hasReachedTarget() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        return Math.sqrt(dx * dx + dy * dy) < GameConfig.EXPLOSION_DETECTION_DISTANCE;
    }
}

class Explosion {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = 0;
        this.maxRadius = type === 'enemy' ? 
            GameConfig.ENEMY_EXPLOSION_RADIUS : 
            GameConfig.PLAYER_EXPLOSION_RADIUS;
        this.age = 0;
        this.duration = GameConfig.EXPLOSION_DURATION;
    }
    
    update(deltaTime) {
        this.age += deltaTime;
        this.radius = Math.min(this.maxRadius, this.age / 10);
        return this.age <= this.duration;
    }
    
    getAlpha() {
        return 1 - (this.age / this.duration);
    }
}

class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * GameConfig.PARTICLE_SPEED_RANGE;
        this.vy = (Math.random() - 0.5) * GameConfig.PARTICLE_SPEED_RANGE;
        this.life = GameConfig.PARTICLE_BASE_LIFE + Math.random() * GameConfig.PARTICLE_LIFE_RANGE;
        this.maxLife = this.life;
        this.color = type === 'enemy' ? 
            GameConfig.COLORS.ENEMY_EXPLOSION : 
            GameConfig.COLORS.PLAYER_EXPLOSION;
    }
    
    update(deltaTime) {
        this.x += this.vx * deltaTime / 1000;
        this.y += this.vy * deltaTime / 1000;
        this.life -= deltaTime;
        return this.life > 0;
    }
    
    getAlpha() {
        return this.life / this.maxLife;
    }
}

class City {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.alive = true;
    }
    
    isHit(x, y) {
        return this.alive && 
               x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height;
    }
    
    destroy() {
        this.alive = false;
    }
    
    repair() {
        this.alive = true;
    }
}

class LaunchPad {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 0; // 用于目标选择的兼容性
    }
} 