// 背景渲染模块
class BackgroundRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
    }
    
    clearCanvas(level = 1, time = 0) {
        // 获取城市主题配置
        const cityTheme = this.getCityTheme(level);
        
        // 创建城市主题的天空渐变
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, cityTheme.skyGradient[0]);
        gradient.addColorStop(1, cityTheme.skyGradient[1]);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 添加城市氛围特效
        this.drawCityAtmosphere(level, cityTheme, time);
    }
    
    getCityTheme(level) {
        // 获取城市主题，如果超出范围则循环使用
        const cityThemes = GameConfig.CITY_THEMES;
        const themeKeys = Object.keys(cityThemes);
        const themeIndex = ((level - 1) % themeKeys.length) + 1;
        
        return cityThemes[themeIndex] || cityThemes[1]; // 默认返回北京主题
    }
    
    drawCityAtmosphere(level, cityTheme, time) {
        const ctx = this.ctx;
        
        // 根据城市氛围添加特效
        switch(cityTheme.atmosphere) {
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
        const cityTheme = this.getCityTheme(level);
        
        // 多层星空效果，根据城市主题调整
        this.ctx.globalAlpha = 0.6;
        
        // 根据城市氛围调整星星数量
        const starCount = this.getStarCount(cityTheme.atmosphere);
        
        // 远景星星
        for (let i = 0; i < starCount.small; i++) {
            const x = (i * 137 + Math.sin(time * 0.5 + i) * 0.5) % this.width;
            const y = (i * 197) % (this.height * 0.6);
            const twinkle = 0.5 + 0.5 * Math.sin(time * 2 + i);
            
            this.ctx.fillStyle = `${cityTheme.starColor}${Math.floor(twinkle * 255 * 0.6).toString(16).padStart(2, '0')}`;
            this.ctx.fillRect(x, y, 1, 1);
        }
        
        // 近景大星星
        for (let i = 0; i < starCount.large; i++) {
            const x = (i * 241 + Math.sin(time * 0.3 + i) * 1) % this.width;
            const y = (i * 317) % (this.height * 0.5);
            const twinkle = 0.3 + 0.7 * Math.sin(time * 1.5 + i * 2);
            const size = 1 + twinkle * 1;
            
            this.ctx.fillStyle = `${cityTheme.starColor}${Math.floor(twinkle * 255).toString(16).padStart(2, '0')}`;
            this.ctx.fillRect(x, y, size, size);
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    getStarCount(atmosphere) {
        switch(atmosphere) {
            case 'oceanic': return { small: 120, large: 25 };  // 海边城市，星星更多
            case 'futuristic': return { small: 80, large: 15 }; // 科技城市，星星较少
            case 'foggy': return { small: 60, large: 10 };     // 雾都，星星很少
            case 'urban': return { small: 70, large: 12 };     // 都市，光污染
            case 'neon': return { small: 90, large: 18 };      // 霓虹城市
            case 'romantic': return { small: 110, large: 22 }; // 浪漫城市
            case 'majestic': return { small: 100, large: 20 }; // 古都
            case 'modern': return { small: 85, large: 16 };    // 现代城市
            default: return { small: 100, large: 20 };
        }
    }
    
    drawGround(groundLevel, level = 1) {
        const cityTheme = this.getCityTheme(level);
        
        // 创建城市主题的地面渐变
        const gradient = this.ctx.createLinearGradient(0, groundLevel, 0, this.height);
        gradient.addColorStop(0, cityTheme.groundColor);
        gradient.addColorStop(0.3, this.darkenColor(cityTheme.groundColor, 0.3));
        gradient.addColorStop(1, this.darkenColor(cityTheme.groundColor, 0.6));
        
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
    
    // 辅助函数：使颜色变暗
    darkenColor(color, factor) {
        // 简单的颜色变暗函数，适用于十六进制颜色
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const newR = Math.floor(r * (1 - factor));
        const newG = Math.floor(g * (1 - factor));
        const newB = Math.floor(b * (1 - factor));
        
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
} 