// 静态对象渲染模块
class ObjectRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
    }
    
    drawCities(cities, level = 1, time = 0) {
        // 获取城市主题
        const cityTheme = this.getCityTheme(level);
        
        cities.forEach((city, index) => {
            if (city.alive) {
                this.drawThemedCity(city, index, cityTheme, time);
            } else {
                this.drawDestroyedCity(city);
            }
        });
    }
    
    getCityTheme(level) {
        // 获取城市主题，与BackgroundRenderer保持一致
        const cityThemes = GameConfig.CITY_THEMES;
        const themeKeys = Object.keys(cityThemes);
        const themeIndex = ((level - 1) % themeKeys.length) + 1;
        
        return cityThemes[themeIndex] || cityThemes[1];
    }
    
    drawThemedCity(city, index, cityTheme, time) {
        const ctx = this.ctx;
        
        // 城市基础阴影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(city.x + 3, city.y + 3, city.width, city.height);
        
        // 主建筑渐变 - 使用城市主题颜色
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.3));
        buildingGradient.addColorStop(0.5, cityTheme.cityColor);
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.3));
        
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 建筑边框发光 - 使用城市主题颜色
        ctx.strokeStyle = cityTheme.cityLights;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        ctx.strokeRect(city.x, city.y, city.width, city.height);
        ctx.globalAlpha = 1;
        
        // 现代化窗户
        for (let floor = 0; floor < 4; floor++) {
            for (let window = 0; window < 3; window++) {
                const wx = city.x + 8 + window * 16;
                const wy = city.y + 5 + floor * 8;
                const lightIntensity = 0.5 + 0.5 * Math.sin(time * 3 + index * 2 + floor + window);
                
                // 窗户背景
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fillRect(wx, wy, 12, 6);
                
                // 窗户光效 - 使用城市主题颜色
                if (Math.random() > 0.2) {
                    const lightColor = this.hexToRgb(cityTheme.cityLights);
                    ctx.fillStyle = `rgba(${lightColor.r}, ${lightColor.g}, ${lightColor.b}, ${lightIntensity * 0.8})`;
                    ctx.fillRect(wx + 1, wy + 1, 10, 4);
                    
                    // 窗户发光效果
                    ctx.shadowColor = cityTheme.cityLights;
                    ctx.shadowBlur = 5;
                    ctx.fillRect(wx + 1, wy + 1, 10, 4);
                    ctx.shadowBlur = 0;
                }
            }
        }
        
        // 建筑顶部信号灯
        const blinkTime = Math.sin(time * 4 + index);
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
    
    drawLaunchPad(launchPad, time = 0) {
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
        const statusBlink = Math.sin(time * 6) > 0;
        if (statusBlink) {
            ctx.fillStyle = '#00ff00';
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 8;
            ctx.fillRect(launchPad.x - 2, launchPad.y - 25, 4, 2);
            ctx.shadowBlur = 0;
        }
    }
    
    // 颜色处理辅助函数
    darkenColor(color, factor) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const newR = Math.floor(r * (1 - factor));
        const newG = Math.floor(g * (1 - factor));
        const newB = Math.floor(b * (1 - factor));
        
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    
    lightenColor(color, factor) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const newR = Math.min(255, Math.floor(r + (255 - r) * factor));
        const newG = Math.min(255, Math.floor(g + (255 - g) * factor));
        const newB = Math.min(255, Math.floor(b + (255 - b) * factor));
        
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r: 255, g: 255, b: 255};
    }
} 