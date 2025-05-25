// 北京城市渲染器 - 天安门和传统建筑
class BeijingRenderer extends BaseCityRenderer {
    constructor() {
        super();
        this.name = '北京';
        this.nameEn = 'Beijing';
    }
    
    render(city, index, cityTheme, time, ctx) {
        // 传统建筑基础
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.3));
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.2));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 传统屋顶（飞檐）
        this.drawTraditionalRoof(city, ctx);
        
        // 天安门风格门楼（中间城市）
        if (index === 2) {
            this.drawTiananmenGate(city, ctx);
        }
        
        // 传统窗户
        this.drawTraditionalWindows(city, cityTheme, time, index, ctx);
    }
    
    drawTraditionalRoof(city, ctx) {
        ctx.fillStyle = '#8b0000';
        ctx.beginPath();
        ctx.moveTo(city.x - 5, city.y);
        ctx.lineTo(city.x + city.width + 5, city.y);
        ctx.lineTo(city.x + city.width, city.y - 8);
        ctx.lineTo(city.x, city.y - 8);
        ctx.closePath();
        ctx.fill();
    }
    
    drawTiananmenGate(city, ctx) {
        ctx.fillStyle = '#8b0000';
        ctx.fillRect(city.x + 20, city.y - 15, 20, 15);
        ctx.fillStyle = '#000';
        ctx.fillRect(city.x + 25, city.y - 10, 10, 10);
    }
    
    drawTraditionalWindows(city, cityTheme, time, index, ctx) {
        for (let i = 0; i < 3; i++) {
            const wx = city.x + 8 + i * 18;
            const wy = city.y + 8;
            
            // 传统窗户框架
            ctx.strokeStyle = cityTheme.cityLights;
            ctx.lineWidth = 2;
            ctx.strokeRect(wx, wy, 12, 16);
            
            // 窗户光效
            const lightIntensity = 0.5 + 0.5 * Math.sin(time * 2 + index + i);
            ctx.fillStyle = `rgba(255, 215, 0, ${lightIntensity * 0.6})`;
            ctx.fillRect(wx + 1, wy + 1, 10, 14);
        }
    }
} 