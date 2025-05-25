// 次时代游戏渲染类
class GameRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
        this.time = 0; // 用于动画效果
    }
    
    update(deltaTime) {
        this.time += deltaTime * 0.001; // 转换为秒
    }
    
    clearCanvas(level = 1) {
        // 根据关卡选择不同的背景主题
        const backgroundTheme = this.getBackgroundTheme(level);
        
        // 创建动态渐变背景
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, backgroundTheme.sky.top);
        gradient.addColorStop(0.3, backgroundTheme.sky.upper);
        gradient.addColorStop(0.7, backgroundTheme.sky.lower);
        gradient.addColorStop(1, backgroundTheme.sky.bottom);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 添加关卡特效
        this.drawBackgroundEffects(level, backgroundTheme);
    }
    
    getBackgroundTheme(level) {
        if (level <= 3) {
            // 早期关卡：平静的夜空
            return {
                sky: {
                    top: '#0a0a2e',
                    upper: '#16213e', 
                    lower: '#1a1a3a',
                    bottom: '#0f0f23'
                },
                stars: { color: '#ffffff', intensity: 0.8, count: 100 },
                effects: 'peaceful'
            };
        } else if (level <= 6) {
            // 中期关卡：警戒状态
            return {
                sky: {
                    top: '#2e0a1a',
                    upper: '#3e1626',
                    lower: '#3a1a2a', 
                    bottom: '#23070f'
                },
                stars: { color: '#ffcccc', intensity: 0.9, count: 120 },
                effects: 'alert'
            };
        } else if (level <= 10) {
            // 高难度关卡：战争状态
            return {
                sky: {
                    top: '#2e1a0a',
                    upper: '#3e2616',
                    lower: '#3a2a1a',
                    bottom: '#23150f'
                },
                stars: { color: '#ffaa66', intensity: 1.0, count: 140 },
                effects: 'war'
            };
        } else {
            // 极高关卡：末日状态
            return {
                sky: {
                    top: '#3e0a2e',
                    upper: '#4e1640',
                    lower: '#4a1a3e',
                    bottom: '#2e0723'
                },
                stars: { color: '#ff66aa', intensity: 1.2, count: 160 },
                effects: 'apocalypse'
            };
        }
    }
    
    drawBackgroundEffects(level, theme) {
        const ctx = this.ctx;
        
        // 根据关卡添加不同的背景特效（降低强度，减少闪烁）
        switch(theme.effects) {
            case 'alert':
                // 警戒状态：非常微妙的红色氛围（减少脉动）
                const alertIntensity = 0.01 + 0.005 * Math.sin(this.time * 0.5); // 降低频率和强度
                const alertGradient = ctx.createLinearGradient(0, 0, 0, this.height);
                alertGradient.addColorStop(0, `rgba(255, 120, 120, ${alertIntensity})`);
                alertGradient.addColorStop(0.6, `rgba(255, 140, 140, ${alertIntensity * 0.7})`);
                alertGradient.addColorStop(1, 'rgba(255, 160, 160, 0)');
                ctx.fillStyle = alertGradient;
                ctx.fillRect(0, 0, this.width, this.height);
                break;
                
            case 'war':
                // 战争状态：温和的橙色氛围（减少强度）
                const warIntensity = 0.02 + 0.01 * Math.sin(this.time * 0.8); // 降低频率和强度
                const warGradient = ctx.createLinearGradient(0, 0, 0, this.height);
                warGradient.addColorStop(0, `rgba(255, 180, 100, ${warIntensity})`);
                warGradient.addColorStop(0.5, `rgba(255, 160, 80, ${warIntensity * 0.8})`);
                warGradient.addColorStop(1, 'rgba(255, 140, 60, 0)');
                ctx.fillStyle = warGradient;
                ctx.fillRect(0, 0, this.width, this.height);
                
                // 更柔和的烟雾粒子（减少数量）
                for (let i = 0; i < 2; i++) {
                    const smokeX = (i * 400 + this.time * 5 + Math.sin(this.time * 0.3 + i) * 30) % (this.width + 60);
                    const smokeY = (i * 200 + this.time * 1.5) % (this.height * 0.7);
                    const smokeAlpha = 0.03 + 0.02 * Math.sin(this.time * 0.5 + i); // 降低透明度
                    
                    // 创建更柔和的烟雾渐变
                    const smokeGradient = ctx.createRadialGradient(smokeX, smokeY, 0, smokeX, smokeY, 30);
                    smokeGradient.addColorStop(0, `rgba(100, 60, 30, ${smokeAlpha})`);
                    smokeGradient.addColorStop(1, 'rgba(100, 60, 30, 0)');
                    ctx.fillStyle = smokeGradient;
                    ctx.fillRect(smokeX - 30, smokeY - 30, 60, 60);
                }
                break;
                
            case 'apocalypse':
                // 末日状态：柔和的紫色氛围（大幅减少强度）
                const apocalypseIntensity = 0.025 + 0.015 * Math.sin(this.time * 0.6); // 降低频率和强度
                const apocalypseGradient = ctx.createLinearGradient(0, 0, 0, this.height);
                apocalypseGradient.addColorStop(0, `rgba(200, 100, 180, ${apocalypseIntensity})`);
                apocalypseGradient.addColorStop(0.4, `rgba(180, 80, 160, ${apocalypseIntensity * 0.8})`);
                apocalypseGradient.addColorStop(0.8, `rgba(160, 60, 140, ${apocalypseIntensity * 0.4})`);
                apocalypseGradient.addColorStop(1, 'rgba(140, 40, 120, 0)');
                ctx.fillStyle = apocalypseGradient;
                ctx.fillRect(0, 0, this.width, this.height);
                
                // 移除闪电效果，改为更柔和的能量波动
                const energyWave = 0.02 + 0.01 * Math.sin(this.time * 0.4);
                if (energyWave > 0.025) {
                    const waveGradient = ctx.createRadialGradient(
                        this.width * 0.5, this.height * 0.3, 0,
                        this.width * 0.5, this.height * 0.3, this.width * 0.3
                    );
                    waveGradient.addColorStop(0, `rgba(255, 255, 255, ${(energyWave - 0.025) * 0.1})`);
                    waveGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    ctx.fillStyle = waveGradient;
                    ctx.fillRect(0, 0, this.width, this.height);
                }
                
                // 更少更柔和的漂浮粒子
                for (let i = 0; i < 4; i++) {
                    const particleX = (i * 200 + this.time * 8 + Math.sin(this.time * 0.2 + i) * 20) % (this.width + 30);
                    const particleY = (i * 180 + this.time * 3) % (this.height * 0.9);
                    const particleAlpha = 0.04 + 0.03 * Math.sin(this.time * 0.8 + i); // 降低透明度
                    
                    // 创建更柔和的粒子渐变
                    const particleGradient = ctx.createRadialGradient(particleX, particleY, 0, particleX, particleY, 4);
                    particleGradient.addColorStop(0, `rgba(180, 140, 200, ${particleAlpha})`);
                    particleGradient.addColorStop(1, 'rgba(180, 140, 200, 0)');
                    ctx.fillStyle = particleGradient;
                    ctx.fillRect(particleX - 4, particleY - 4, 8, 8);
                }
                break;
        }
    }
    
    drawStars(level = 1) {
        const theme = this.getBackgroundTheme(level);
        const starConfig = theme.stars;
        
        // 多层星空效果，根据关卡调整
        this.ctx.globalAlpha = starConfig.intensity * 0.8;
        
        // 远景星星
        for (let i = 0; i < starConfig.count; i++) {
            const x = (i * 137 + Math.sin(this.time * 0.5 + i) * 0.5) % this.width;
            const y = (i * 197) % (this.height * 0.6);
            const twinkle = 0.5 + 0.5 * Math.sin(this.time * 2 + i);
            
            this.ctx.fillStyle = `${starConfig.color}${Math.floor(twinkle * 255 * 0.6).toString(16).padStart(2, '0')}`;
            this.ctx.fillRect(x, y, 1, 1);
        }
        
        // 近景大星星，高关卡有更多
        const bigStarCount = level > 5 ? 30 : 20;
        for (let i = 0; i < bigStarCount; i++) {
            const x = (i * 241 + Math.sin(this.time * 0.3 + i) * 1) % this.width;
            const y = (i * 317) % (this.height * 0.5);
            const twinkle = 0.3 + 0.7 * Math.sin(this.time * 1.5 + i * 2);
            const size = 1 + twinkle * (level > 10 ? 1.5 : 1);
            
            this.ctx.fillStyle = `${starConfig.color}${Math.floor(twinkle * 255).toString(16).padStart(2, '0')}`;
            this.ctx.fillRect(x, y, size, size);
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    drawGround(groundLevel) {
        // 创建地面渐变
        const gradient = this.ctx.createLinearGradient(0, groundLevel, 0, this.height);
        gradient.addColorStop(0, '#2d4a3e');
        gradient.addColorStop(0.3, '#1e3329');
        gradient.addColorStop(1, '#0f1a14');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, groundLevel, this.width, this.height - groundLevel);
        
        // 添加地面光效线条
        this.ctx.strokeStyle = 'rgba(0, 255, 100, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for (let i = 0; i < this.width; i += 40) {
            this.ctx.moveTo(i, groundLevel);
            this.ctx.lineTo(i, this.height);
        }
        this.ctx.stroke();
    }
    
    drawCities(cities) {
        cities.forEach((city, index) => {
            if (city.alive) {
                this.drawModernCity(city, index);
            } else {
                this.drawDestroyedCity(city);
            }
        });
    }
    
    drawModernCity(city, index) {
        const ctx = this.ctx;
        
        // 城市基础阴影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(city.x + 3, city.y + 3, city.width, city.height);
        
        // 主建筑渐变
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, '#4fc3f7');
        buildingGradient.addColorStop(0.5, '#29b6f6');
        buildingGradient.addColorStop(1, '#0277bd');
        
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 建筑边框发光
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        ctx.strokeRect(city.x, city.y, city.width, city.height);
        ctx.globalAlpha = 1;
        
        // 现代化窗户
        for (let floor = 0; floor < 4; floor++) {
            for (let window = 0; window < 3; window++) {
                const wx = city.x + 8 + window * 16;
                const wy = city.y + 5 + floor * 8;
                const lightIntensity = 0.5 + 0.5 * Math.sin(this.time * 3 + index * 2 + floor + window);
                
                // 窗户背景
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fillRect(wx, wy, 12, 6);
                
                // 窗户光效
                if (Math.random() > 0.2) {
                    ctx.fillStyle = `rgba(255, 255, 0, ${lightIntensity * 0.8})`;
                    ctx.fillRect(wx + 1, wy + 1, 10, 4);
                    
                    // 窗户发光效果
                    ctx.shadowColor = '#ffff00';
                    ctx.shadowBlur = 5;
                    ctx.fillRect(wx + 1, wy + 1, 10, 4);
                    ctx.shadowBlur = 0;
                }
            }
        }
        
        // 建筑顶部信号灯
        const blinkTime = Math.sin(this.time * 4 + index);
        if (blinkTime > 0) {
            ctx.fillStyle = '#ff4444';
            ctx.shadowColor = '#ff4444';
            ctx.shadowBlur = 10;
            ctx.fillRect(city.x + city.width / 2 - 2, city.y - 5, 4, 4);
            ctx.shadowBlur = 0;
        }
    }
    
    drawDestroyedCity(city) {
        const ctx = this.ctx;
        
        // 废墟效果
        ctx.fillStyle = '#333333';
        ctx.fillRect(city.x, city.y + city.height * 0.7, city.width, city.height * 0.3);
        
        // 残骸
        ctx.fillStyle = '#666666';
        for (let i = 0; i < 5; i++) {
            const debrisX = city.x + Math.random() * city.width;
            const debrisY = city.y + city.height * 0.6 + Math.random() * city.height * 0.4;
            ctx.fillRect(debrisX, debrisY, 3, 3);
        }
    }
    
    drawLaunchPad(launchPad) {
        const ctx = this.ctx;
        
        // 发射台基座渐变
        const baseGradient = ctx.createRadialGradient(
            launchPad.x, launchPad.y - 5, 0,
            launchPad.x, launchPad.y - 5, 20
        );
        baseGradient.addColorStop(0, '#888888');
        baseGradient.addColorStop(1, '#333333');
        
        ctx.fillStyle = baseGradient;
        ctx.fillRect(launchPad.x - 15, launchPad.y - 10, 30, 10);
        
        // 发射台顶部
        ctx.fillStyle = '#ff6666';
        ctx.fillRect(launchPad.x - 5, launchPad.y - 20, 10, 10);
        
        // 发射台发光效果
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        ctx.strokeRect(launchPad.x - 15, launchPad.y - 10, 30, 10);
        ctx.strokeRect(launchPad.x - 5, launchPad.y - 20, 10, 10);
        ctx.globalAlpha = 1;
        
        // 状态指示灯
        const statusBlink = Math.sin(this.time * 6) > 0;
        if (statusBlink) {
            ctx.fillStyle = '#00ff00';
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 8;
            ctx.fillRect(launchPad.x - 2, launchPad.y - 25, 4, 2);
            ctx.shadowBlur = 0;
        }
    }
    
    drawMissiles(missiles, trailColor, missileColor, glowColor) {
        missiles.forEach(missile => {
            this.drawModernMissile(missile, trailColor, missileColor, glowColor);
        });
    }
    
    drawModernMissile(missile, trailColor, missileColor, glowColor) {
        const ctx = this.ctx;
        
        // 绘制发光轨迹
        if (missile.trail.length > 1) {
            for (let i = 1; i < missile.trail.length; i++) {
                const alpha = i / missile.trail.length;
                const point1 = missile.trail[i - 1];
                const point2 = missile.trail[i];
                
                // 主轨迹
                ctx.globalAlpha = alpha * 0.8;
                ctx.strokeStyle = trailColor;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(point1.x, point1.y);
                ctx.lineTo(point2.x, point2.y);
                ctx.stroke();
                
                // 发光效果
                ctx.globalAlpha = alpha * 0.4;
                ctx.strokeStyle = glowColor;
                ctx.lineWidth = 6;
                ctx.shadowColor = glowColor;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.moveTo(point1.x, point1.y);
                ctx.lineTo(point2.x, point2.y);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
            ctx.globalAlpha = 1;
        }
        
        // 绘制导弹本体
        const pulseSize = 1 + 0.3 * Math.sin(this.time * 20);
        
        // 导弹发光效果
        ctx.fillStyle = glowColor;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 12;
        ctx.fillRect(missile.x - 3 * pulseSize, missile.y - 3 * pulseSize, 6 * pulseSize, 6 * pulseSize);
        ctx.shadowBlur = 0;
        
        // 导弹核心
        ctx.fillStyle = missileColor;
        ctx.fillRect(missile.x - 2, missile.y - 2, 4, 4);
    }
    
    drawPlayerMissiles(missiles) {
        this.drawMissiles(missiles, '#00ffff', '#ffffff', '#00dddd');
    }
    
    drawEnemyMissiles(missiles) {
        missiles.forEach(missile => {
            this.drawEnemyMissile(missile);
        });
    }
    
    drawEnemyMissile(missile) {
        const ctx = this.ctx;
        
        // 使用速度向量计算导弹方向角度（这样更准确）
        const angle = Math.atan2(missile.vy, missile.vx);
        
        // 绘制威胁性轨迹
        if (missile.trail.length > 1) {
            for (let i = 1; i < missile.trail.length; i++) {
                const alpha = i / missile.trail.length;
                const point1 = missile.trail[i - 1];
                const point2 = missile.trail[i];
                
                // 主轨迹 - 更粗更明显
                ctx.globalAlpha = alpha * 0.9;
                ctx.strokeStyle = '#ff4444';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(point1.x, point1.y);
                ctx.lineTo(point2.x, point2.y);
                ctx.stroke();
                
                // 强烈发光效果
                ctx.globalAlpha = alpha * 0.6;
                ctx.strokeStyle = '#ff8888';
                ctx.lineWidth = 8;
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.moveTo(point1.x, point1.y);
                ctx.lineTo(point2.x, point2.y);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
            ctx.globalAlpha = 1;
        }
        
        // 保存当前状态
        ctx.save();
        
        // 移动到导弹位置并旋转
        ctx.translate(missile.x, missile.y);
        ctx.rotate(angle);
        
        // 绘制导弹发光外圈
        const pulseIntensity = 0.8 + 0.4 * Math.sin(this.time * 25);
        ctx.fillStyle = `rgba(255, 0, 0, ${pulseIntensity * 0.3})`;
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 15;
        ctx.fillRect(-8, -8, 16, 16);
        ctx.shadowBlur = 0;
        
        // 绘制导弹主体（火箭形状，头部朝右）
        ctx.fillStyle = '#cc0000';
        // 导弹头部（尖锐）
        ctx.beginPath();
        ctx.moveTo(8, 0);    // 头部尖端
        ctx.lineTo(2, -3);   // 上侧
        ctx.lineTo(-4, -2);  // 上身
        ctx.lineTo(-4, 2);   // 下身
        ctx.lineTo(2, 3);    // 下侧
        ctx.closePath();
        ctx.fill();
        
        // 导弹核心发光
        ctx.fillStyle = '#ff6666';
        ctx.beginPath();
        ctx.moveTo(6, 0);
        ctx.lineTo(0, -2);
        ctx.lineTo(-2, -1);
        ctx.lineTo(-2, 1);
        ctx.lineTo(0, 2);
        ctx.closePath();
        ctx.fill();
        
        // 导弹尾部火焰效果
        const flameLength = 8 + 4 * Math.sin(this.time * 30);
        const flameFlicker = 0.5 + 0.5 * Math.sin(this.time * 40);
        
        // 外层火焰
        ctx.fillStyle = `rgba(255, 100, 0, ${flameFlicker * 0.8})`;
        ctx.beginPath();
        ctx.moveTo(-4, 0);
        ctx.lineTo(-4 - flameLength, -4);
        ctx.lineTo(-4 - flameLength * 0.7, 0);
        ctx.lineTo(-4 - flameLength, 4);
        ctx.closePath();
        ctx.fill();
        
        // 内层火焰
        ctx.fillStyle = `rgba(255, 200, 0, ${flameFlicker})`;
        ctx.beginPath();
        ctx.moveTo(-4, 0);
        ctx.lineTo(-4 - flameLength * 0.6, -2);
        ctx.lineTo(-4 - flameLength * 0.4, 0);
        ctx.lineTo(-4 - flameLength * 0.6, 2);
        ctx.closePath();
        ctx.fill();
        
        // 导弹边框高光
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(2, -3);
        ctx.lineTo(-4, -2);
        ctx.lineTo(-4, 2);
        ctx.lineTo(2, 3);
        ctx.closePath();
        ctx.stroke();
        
        // 恢复状态
        ctx.restore();
    }
    
    drawExplosions(explosions) {
        explosions.forEach(explosion => {
            this.drawModernExplosion(explosion);
        });
    }
    
    drawModernExplosion(explosion) {
        const ctx = this.ctx;
        const alpha = explosion.getAlpha();
        const radius = explosion.radius;
        
        // 冲击波环
        ctx.globalAlpha = alpha * 0.3;
        ctx.strokeStyle = explosion.type === 'enemy' ? '#ff6666' : '#ffff66';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, radius * 1.2, 0, Math.PI * 2);
        ctx.stroke();
        
        // 外层光晕
        const outerGradient = ctx.createRadialGradient(
            explosion.x, explosion.y, 0,
            explosion.x, explosion.y, radius
        );
        outerGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`);
        outerGradient.addColorStop(0.3, explosion.type === 'enemy' ? 
            `rgba(255, 100, 100, ${alpha * 0.6})` : 
            `rgba(255, 255, 100, ${alpha * 0.6})`);
        outerGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        
        ctx.globalAlpha = alpha * 0.7;
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 内层核心
        const coreGradient = ctx.createRadialGradient(
            explosion.x, explosion.y, 0,
            explosion.x, explosion.y, radius * 0.5
        );
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        coreGradient.addColorStop(0.7, `rgba(255, 255, 200, ${alpha * 0.8})`);
        coreGradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // 火花效果
        ctx.globalAlpha = alpha * 0.8;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + this.time * 2;
            const sparkX = explosion.x + Math.cos(angle) * radius * 0.8;
            const sparkY = explosion.y + Math.sin(angle) * radius * 0.8;
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(sparkX - 1, sparkY - 1, 2, 2);
        }
        
        ctx.globalAlpha = 1;
    }
    
    drawParticles(particles) {
        particles.forEach(particle => {
            const ctx = this.ctx;
            const alpha = particle.getAlpha();
            
            // 粒子发光效果
            ctx.globalAlpha = alpha * 0.8;
            ctx.fillStyle = particle.color;
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 4;
            ctx.fillRect(particle.x - 1.5, particle.y - 1.5, 3, 3);
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        });
    }
    
    drawLevelCompleteMessage() {
        const ctx = this.ctx;
        
        // 背景光效
        ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // 主文字
        ctx.fillStyle = '#00ff00';
        ctx.font = GameConfig.FONTS.MEDIUM;
        ctx.textAlign = 'center';
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 20;
        ctx.fillText('关卡完成！', this.width / 2, this.height / 2 - 50);
        
        // 副文字
        ctx.font = GameConfig.FONTS.NORMAL;
        ctx.shadowBlur = 10;
        ctx.fillText('准备下一关...', this.width / 2, this.height / 2);
        ctx.shadowBlur = 0;
    }
    
    drawGameInfo(enemyMissilesSpawned, enemyMissilesToSpawn, enemyMissilesOnScreen) {
        const ctx = this.ctx;
        
        // 信息面板背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(5, 5, 300, 30);
        
        ctx.fillStyle = '#00ffff';
        ctx.font = GameConfig.FONTS.SMALL;
        ctx.textAlign = 'left';
        ctx.fillText(
            `敌方导弹: ${enemyMissilesSpawned}/${enemyMissilesToSpawn} 屏幕上: ${enemyMissilesOnScreen}`, 
            10, 25
        );
    }
    
    drawPauseScreen() {
        const ctx = this.ctx;
        
        // 模糊覆盖层效果
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // 暂停文字发光效果
        ctx.fillStyle = '#ffffff';
        ctx.font = GameConfig.FONTS.LARGE;
        ctx.textAlign = 'center';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 20;
        ctx.fillText('游戏暂停', this.width / 2, this.height / 2);
        ctx.shadowBlur = 0;
    }
} 