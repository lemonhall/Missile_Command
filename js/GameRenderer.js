// 游戏渲染类
class GameRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
    }
    
    clearCanvas() {
        this.ctx.fillStyle = GameConfig.COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    drawStars() {
        this.ctx.fillStyle = GameConfig.COLORS.STAR;
        for (let i = 0; i < 50; i++) {
            const x = (i * 137) % this.width;
            const y = (i * 197) % (this.height / 2);
            this.ctx.fillRect(x, y, 1, 1);
        }
    }
    
    drawGround(groundLevel) {
        this.ctx.fillStyle = GameConfig.COLORS.GROUND;
        this.ctx.fillRect(0, groundLevel, this.width, this.height - groundLevel);
    }
    
    drawCities(cities) {
        cities.forEach(city => {
            if (city.alive) {
                // 绘制城市主体
                this.ctx.fillStyle = GameConfig.COLORS.CITY;
                this.ctx.fillRect(city.x, city.y, city.width, city.height);
                
                // 绘制建筑细节（窗户）
                this.ctx.fillStyle = GameConfig.COLORS.CITY_LIGHTS;
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
    }
    
    drawLaunchPad(launchPad) {
        // 绘制发射台底座
        this.ctx.fillStyle = GameConfig.COLORS.LAUNCH_PAD;
        this.ctx.fillRect(launchPad.x - 15, launchPad.y - 10, 30, 10);
        
        // 绘制发射台顶部
        this.ctx.fillStyle = GameConfig.COLORS.LAUNCH_PAD_TOP;
        this.ctx.fillRect(launchPad.x - 5, launchPad.y - 20, 10, 10);
    }
    
    drawMissiles(missiles, trailColor, missileColor) {
        missiles.forEach(missile => {
            // 绘制轨迹
            if (missile.trail.length > 1) {
                this.ctx.strokeStyle = trailColor;
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
            }
            
            // 绘制导弹
            this.ctx.fillStyle = missileColor;
            this.ctx.fillRect(missile.x - 2, missile.y - 2, 4, 4);
        });
    }
    
    drawPlayerMissiles(missiles) {
        this.drawMissiles(missiles, GameConfig.COLORS.PLAYER_TRAIL, GameConfig.COLORS.PLAYER_MISSILE);
    }
    
    drawEnemyMissiles(missiles) {
        this.drawMissiles(missiles, GameConfig.COLORS.ENEMY_TRAIL, GameConfig.COLORS.ENEMY_MISSILE);
    }
    
    drawExplosions(explosions) {
        explosions.forEach(explosion => {
            const alpha = explosion.getAlpha();
            
            // 绘制外圈
            this.ctx.globalAlpha = alpha * 0.3;
            this.ctx.fillStyle = explosion.type === 'enemy' ? 
                GameConfig.COLORS.ENEMY_EXPLOSION : 
                GameConfig.COLORS.PLAYER_EXPLOSION;
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 绘制内圈
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = GameConfig.COLORS.EXPLOSION_CORE;
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, explosion.radius * 0.6, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.globalAlpha = 1;
        });
    }
    
    drawParticles(particles) {
        particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.getAlpha();
            this.ctx.fillRect(particle.x - 1, particle.y - 1, 2, 2);
            this.ctx.globalAlpha = 1;
        });
    }
    
    drawLevelCompleteMessage() {
        this.ctx.fillStyle = GameConfig.COLORS.UI_TEXT;
        this.ctx.font = GameConfig.FONTS.MEDIUM;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('关卡完成！', this.width / 2, this.height / 2 - 50);
        this.ctx.font = GameConfig.FONTS.NORMAL;
        this.ctx.fillText('准备下一关...', this.width / 2, this.height / 2);
    }
    
    drawGameInfo(enemyMissilesSpawned, enemyMissilesToSpawn, enemyMissilesOnScreen) {
        this.ctx.fillStyle = GameConfig.COLORS.INFO_TEXT;
        this.ctx.font = GameConfig.FONTS.SMALL;
        this.ctx.textAlign = 'left';
        this.ctx.fillText(
            `敌方导弹: ${enemyMissilesSpawned}/${enemyMissilesToSpawn} 屏幕上: ${enemyMissilesOnScreen}`, 
            10, 30
        );
    }
    
    drawPauseScreen() {
        // 绘制半透明覆盖层
        this.ctx.fillStyle = GameConfig.COLORS.PAUSE_OVERLAY;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 绘制暂停文字
        this.ctx.fillStyle = GameConfig.COLORS.UI_TEXT;
        this.ctx.font = GameConfig.FONTS.LARGE;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏暂停', this.width / 2, this.height / 2);
    }
} 