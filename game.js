class MissileCommand {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // 游戏状态
        this.gameState = 'waiting'; // waiting, playing, paused, gameOver
        this.score = 0;
        this.level = 1;
        this.cities = [];
        this.missiles = [];
        this.enemyMissiles = [];
        this.explosions = [];
        this.particles = [];
        
        // 游戏设置
        this.groundLevel = this.height - 80;
        this.launchPad = { x: this.width / 2, y: this.groundLevel };
        this.citiesRemaining = 6;
        
        // 控制变量
        this.lastTime = 0;
        this.animationId = null;
        
        this.init();
        this.bindEvents();
    }
    
    init() {
        // 创建城市
        this.cities = [];
        const cityWidth = 60;
        const citySpacing = (this.width - 6 * cityWidth) / 7;
        
        for (let i = 0; i < 6; i++) {
            this.cities.push({
                x: citySpacing + i * (cityWidth + citySpacing),
                y: this.groundLevel - 40,
                width: cityWidth,
                height: 40,
                alive: true
            });
        }
        
        this.citiesRemaining = 6;
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
    
    start() {
        this.gameState = 'playing';
        this.gameLoop();
        this.spawnEnemyMissiles();
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            cancelAnimationFrame(this.animationId);
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.gameLoop();
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
        cancelAnimationFrame(this.animationId);
        
        this.init();
        document.getElementById('gameOverScreen').classList.add('hidden');
    }
    
    fireMissile(targetX, targetY) {
        // 限制导弹数量
        if (this.missiles.length >= 3) return;
        
        const dx = targetX - this.launchPad.x;
        const dy = targetY - this.launchPad.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 300; // 像素/秒
        
        this.missiles.push({
            x: this.launchPad.x,
            y: this.launchPad.y,
            targetX: targetX,
            targetY: targetY,
            vx: (dx / distance) * speed,
            vy: (dy / distance) * speed,
            trail: []
        });
    }
    
    spawnEnemyMissiles() {
        if (this.gameState !== 'playing') return;
        
        const spawnRate = Math.max(1000 - this.level * 100, 200);
        
        setTimeout(() => {
            if (this.gameState === 'playing') {
                this.createEnemyMissile();
                this.spawnEnemyMissiles();
            }
        }, spawnRate + Math.random() * 1000);
    }
    
    createEnemyMissile() {
        const startX = Math.random() * this.width;
        const targets = [...this.cities.filter(city => city.alive), this.launchPad];
        const target = targets[Math.floor(Math.random() * targets.length)];
        
        if (!target) return;
        
        const targetX = target.x + (target.width || 0) / 2;
        const targetY = target.y || this.groundLevel;
        
        const dx = targetX - startX;
        const dy = targetY - 0;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 50 + this.level * 10;
        
        this.enemyMissiles.push({
            x: startX,
            y: 0,
            targetX: targetX,
            targetY: targetY,
            vx: (dx / distance) * speed,
            vy: (dy / distance) * speed,
            trail: []
        });
    }
    
    update(deltaTime) {
        // 更新玩家导弹
        this.missiles.forEach((missile, index) => {
            missile.trail.push({ x: missile.x, y: missile.y });
            if (missile.trail.length > 10) missile.trail.shift();
            
            missile.x += missile.vx * deltaTime / 1000;
            missile.y += missile.vy * deltaTime / 1000;
            
            // 检查是否到达目标
            const dx = missile.targetX - missile.x;
            const dy = missile.targetY - missile.y;
            if (Math.sqrt(dx * dx + dy * dy) < 20) {
                this.createExplosion(missile.x, missile.y, 'player');
                this.missiles.splice(index, 1);
            }
        });
        
        // 更新敌方导弹
        this.enemyMissiles.forEach((missile, index) => {
            missile.trail.push({ x: missile.x, y: missile.y });
            if (missile.trail.length > 8) missile.trail.shift();
            
            missile.x += missile.vx * deltaTime / 1000;
            missile.y += missile.vy * deltaTime / 1000;
            
            // 检查是否击中地面
            if (missile.y >= missile.targetY) {
                this.createExplosion(missile.x, missile.y, 'enemy');
                this.checkCityHit(missile.x, missile.y);
                this.enemyMissiles.splice(index, 1);
            }
        });
        
        // 更新爆炸
        this.explosions.forEach((explosion, index) => {
            explosion.age += deltaTime;
            explosion.radius = Math.min(explosion.maxRadius, explosion.age / 10);
            
            if (explosion.age > explosion.duration) {
                this.explosions.splice(index, 1);
            }
        });
        
        // 更新粒子
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx * deltaTime / 1000;
            particle.y += particle.vy * deltaTime / 1000;
            particle.life -= deltaTime;
            
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
        
        // 碰撞检测
        this.checkCollisions();
        
        // 检查游戏结束条件
        if (this.citiesRemaining <= 0) {
            this.gameOver();
        }
        
        // 检查关卡完成
        if (this.enemyMissiles.length === 0 && this.gameState === 'playing') {
            setTimeout(() => {
                if (this.enemyMissiles.length === 0) {
                    this.nextLevel();
                }
            }, 3000);
        }
    }
    
    checkCollisions() {
        this.explosions.forEach(explosion => {
            if (explosion.type !== 'player') return;
            
            // 检查敌方导弹
            this.enemyMissiles.forEach((missile, index) => {
                const dx = missile.x - explosion.x;
                const dy = missile.y - explosion.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < explosion.radius) {
                    this.score += 25;
                    this.createExplosion(missile.x, missile.y, 'chain');
                    this.enemyMissiles.splice(index, 1);
                    this.updateUI();
                }
            });
        });
    }
    
    checkCityHit(x, y) {
        this.cities.forEach(city => {
            if (city.alive && 
                x >= city.x && x <= city.x + city.width &&
                y >= city.y && y <= city.y + city.height) {
                city.alive = false;
                this.citiesRemaining--;
                this.updateUI();
            }
        });
    }
    
    createExplosion(x, y, type) {
        const explosion = {
            x: x,
            y: y,
            radius: 0,
            maxRadius: type === 'enemy' ? 40 : 60,
            age: 0,
            duration: 1500,
            type: type
        };
        
        this.explosions.push(explosion);
        
        // 创建粒子效果
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 200,
                vy: (Math.random() - 0.5) * 200,
                life: 1000 + Math.random() * 500,
                color: type === 'enemy' ? '#ff0000' : '#ffff00'
            });
        }
    }
    
    nextLevel() {
        this.level++;
        this.score += this.citiesRemaining * 100; // 奖励剩余城市
        this.updateUI();
        
        // 稍微修复一些城市
        if (this.citiesRemaining < 6) {
            const deadCities = this.cities.filter(city => !city.alive);
            if (deadCities.length > 0) {
                const cityToRepair = deadCities[Math.floor(Math.random() * deadCities.length)];
                cityToRepair.alive = true;
                this.citiesRemaining++;
            }
        }
        
        this.spawnEnemyMissiles();
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        cancelAnimationFrame(this.animationId);
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('cities').textContent = this.citiesRemaining;
    }
    
    render() {
        // 清空画布
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 绘制星空背景
        this.drawStars();
        
        // 绘制地面
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(0, this.groundLevel, this.width, this.height - this.groundLevel);
        
        // 绘制城市
        this.cities.forEach(city => {
            if (city.alive) {
                this.ctx.fillStyle = '#00ff00';
                this.ctx.fillRect(city.x, city.y, city.width, city.height);
                
                // 绘制建筑细节
                this.ctx.fillStyle = '#ffff00';
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 4; j++) {
                        if (Math.random() > 0.3) {
                            this.ctx.fillRect(
                                city.x + 5 + i * 18,
                                city.y + 5 + j * 8,
                                8, 6
                            );
                        }
                    }
                }
            }
        });
        
        // 绘制发射台
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(this.launchPad.x - 15, this.launchPad.y - 10, 30, 10);
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(this.launchPad.x - 5, this.launchPad.y - 20, 10, 10);
        
        // 绘制玩家导弹
        this.missiles.forEach(missile => {
            // 绘制轨迹
            this.ctx.strokeStyle = '#00ffff';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            missile.trail.forEach((point, index) => {
                if (index === 0) {
                    this.ctx.moveTo(point.x, point.y);
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            });
            this.ctx.stroke();
            
            // 绘制导弹
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(missile.x - 2, missile.y - 2, 4, 4);
        });
        
        // 绘制敌方导弹
        this.enemyMissiles.forEach(missile => {
            // 绘制轨迹
            this.ctx.strokeStyle = '#ff0000';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            missile.trail.forEach((point, index) => {
                if (index === 0) {
                    this.ctx.moveTo(point.x, point.y);
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            });
            this.ctx.stroke();
            
            // 绘制导弹
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillRect(missile.x - 2, missile.y - 2, 4, 4);
        });
        
        // 绘制爆炸
        this.explosions.forEach(explosion => {
            const alpha = 1 - (explosion.age / explosion.duration);
            
            // 外圈
            this.ctx.globalAlpha = alpha * 0.3;
            this.ctx.fillStyle = explosion.type === 'enemy' ? '#ff0000' : '#ffff00';
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 内圈
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, explosion.radius * 0.6, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.globalAlpha = 1;
        });
        
        // 绘制粒子
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / 1000;
            this.ctx.fillRect(particle.x - 1, particle.y - 1, 2, 2);
            this.ctx.globalAlpha = 1;
        });
        
        // 绘制暂停信息
        if (this.gameState === 'paused') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            this.ctx.fillStyle = '#ffff00';
            this.ctx.font = '48px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('游戏暂停', this.width / 2, this.height / 2);
        }
    }
    
    drawStars() {
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) {
            const x = (i * 137) % this.width;
            const y = (i * 197) % (this.height / 2);
            this.ctx.fillRect(x, y, 1, 1);
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

// 初始化游戏
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new MissileCommand();
}); 