// 背景渲染模块
class BackgroundRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
    }
    
    clearCanvas(level = 1, time = 0) {
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
        this.drawBackgroundEffects(level, backgroundTheme, time);
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
    
    drawBackgroundEffects(level, theme, time) {
        const ctx = this.ctx;
        
        // 根据关卡添加不同的背景特效（降低强度，减少闪烁）
        switch(theme.effects) {
            case 'alert':
                // 警戒状态：非常微妙的红色氛围（减少脉动）
                const alertIntensity = 0.01 + 0.005 * Math.sin(time * 0.5); // 降低频率和强度
                const alertGradient = ctx.createLinearGradient(0, 0, 0, this.height);
                alertGradient.addColorStop(0, `rgba(255, 120, 120, ${alertIntensity})`);
                alertGradient.addColorStop(0.6, `rgba(255, 140, 140, ${alertIntensity * 0.7})`);
                alertGradient.addColorStop(1, 'rgba(255, 160, 160, 0)');
                ctx.fillStyle = alertGradient;
                ctx.fillRect(0, 0, this.width, this.height);
                break;
                
            case 'war':
                // 战争状态：温和的橙色氛围（减少强度）
                const warIntensity = 0.02 + 0.01 * Math.sin(time * 0.8); // 降低频率和强度
                const warGradient = ctx.createLinearGradient(0, 0, 0, this.height);
                warGradient.addColorStop(0, `rgba(255, 180, 100, ${warIntensity})`);
                warGradient.addColorStop(0.5, `rgba(255, 160, 80, ${warIntensity * 0.8})`);
                warGradient.addColorStop(1, 'rgba(255, 140, 60, 0)');
                ctx.fillStyle = warGradient;
                ctx.fillRect(0, 0, this.width, this.height);
                
                // 更柔和的烟雾粒子（减少数量）
                for (let i = 0; i < 2; i++) {
                    const smokeX = (i * 400 + time * 5 + Math.sin(time * 0.3 + i) * 30) % (this.width + 60);
                    const smokeY = (i * 200 + time * 1.5) % (this.height * 0.7);
                    const smokeAlpha = 0.03 + 0.02 * Math.sin(time * 0.5 + i); // 降低透明度
                    
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
                const apocalypseIntensity = 0.025 + 0.015 * Math.sin(time * 0.6); // 降低频率和强度
                const apocalypseGradient = ctx.createLinearGradient(0, 0, 0, this.height);
                apocalypseGradient.addColorStop(0, `rgba(200, 100, 180, ${apocalypseIntensity})`);
                apocalypseGradient.addColorStop(0.4, `rgba(180, 80, 160, ${apocalypseIntensity * 0.8})`);
                apocalypseGradient.addColorStop(0.8, `rgba(160, 60, 140, ${apocalypseIntensity * 0.4})`);
                apocalypseGradient.addColorStop(1, 'rgba(140, 40, 120, 0)');
                ctx.fillStyle = apocalypseGradient;
                ctx.fillRect(0, 0, this.width, this.height);
                
                // 移除闪电效果，改为更柔和的能量波动
                const energyWave = 0.02 + 0.01 * Math.sin(time * 0.4);
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
                    const particleX = (i * 200 + time * 8 + Math.sin(time * 0.2 + i) * 20) % (this.width + 30);
                    const particleY = (i * 180 + time * 3) % (this.height * 0.9);
                    const particleAlpha = 0.04 + 0.03 * Math.sin(time * 0.8 + i); // 降低透明度
                    
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
    
    drawStars(level = 1, time = 0) {
        const theme = this.getBackgroundTheme(level);
        const starConfig = theme.stars;
        
        // 多层星空效果，根据关卡调整
        this.ctx.globalAlpha = starConfig.intensity * 0.8;
        
        // 远景星星
        for (let i = 0; i < starConfig.count; i++) {
            const x = (i * 137 + Math.sin(time * 0.5 + i) * 0.5) % this.width;
            const y = (i * 197) % (this.height * 0.6);
            const twinkle = 0.5 + 0.5 * Math.sin(time * 2 + i);
            
            this.ctx.fillStyle = `${starConfig.color}${Math.floor(twinkle * 255 * 0.6).toString(16).padStart(2, '0')}`;
            this.ctx.fillRect(x, y, 1, 1);
        }
        
        // 近景大星星，高关卡有更多
        const bigStarCount = level > 5 ? 30 : 20;
        for (let i = 0; i < bigStarCount; i++) {
            const x = (i * 241 + Math.sin(time * 0.3 + i) * 1) % this.width;
            const y = (i * 317) % (this.height * 0.5);
            const twinkle = 0.3 + 0.7 * Math.sin(time * 1.5 + i * 2);
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
} 