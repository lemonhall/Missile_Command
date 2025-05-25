// 静态对象渲染模块 - 使用城市渲染器工厂模式
class ObjectRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
        
        // 初始化城市渲染器工厂
        this.cityRendererFactory = new CityRendererFactory();
    }
    
    drawCities(cities, level = 1, time = 0) {
        const cityTheme = this.getCityTheme(level);
        const cityRenderer = this.cityRendererFactory.getRenderer(level);
        
        cities.forEach((city, index) => {
            if (city.alive) {
                // 绘制城市阴影
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                this.ctx.fillRect(city.x + 3, city.y + 3, city.width, city.height);
                
                // 使用对应的城市渲染器绘制
                cityRenderer.render(city, index, cityTheme, time, this.ctx);
            } else {
                this.drawDestroyedCity(city);
            }
        });
    }
    
    getCityTheme(level) {
        const cityThemes = GameConfig.CITY_THEMES;
        const themeKeys = Object.keys(cityThemes);
        const themeIndex = ((level - 1) % themeKeys.length) + 1;
        return cityThemes[themeIndex] || cityThemes[1];
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
} 