// 巴黎城市渲染器 - 埃菲尔铁塔
class ParisRenderer extends BaseCityRenderer {
    constructor() {
        super();
        this.name = '巴黎';
        this.nameEn = 'Paris';
    }
    
    render(city, index, cityTheme, time, ctx) {
        // 法式建筑
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.2));
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.2));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 埃菲尔铁塔（中间城市）
        if (index === 2) {
            this.drawEiffelTower(city, time, ctx);
        }
        
        // 法式阳台窗户
        this.drawFrenchWindows(city, cityTheme, time, ctx);
    }
    
    drawEiffelTower(city, time, ctx) {
        const towerX = city.x + city.width / 2;
        const towerBase = city.y;
        
        ctx.strokeStyle = '#8b7355';
        ctx.lineWidth = 2;
        
        // 底座
        ctx.beginPath();
        ctx.moveTo(towerX - 12, towerBase);
        ctx.lineTo(towerX + 12, towerBase);
        ctx.lineTo(towerX + 8, towerBase - 20);
        ctx.lineTo(towerX - 8, towerBase - 20);
        ctx.closePath();
        ctx.stroke();
        
        // 中段
        ctx.beginPath();
        ctx.moveTo(towerX - 8, towerBase - 20);
        ctx.lineTo(towerX + 8, towerBase - 20);
        ctx.lineTo(towerX + 4, towerBase - 35);
        ctx.lineTo(towerX - 4, towerBase - 35);
        ctx.closePath();
        ctx.stroke();
        
        // 塔尖
        ctx.beginPath();
        ctx.moveTo(towerX, towerBase - 35);
        ctx.lineTo(towerX, towerBase - 50);
        ctx.stroke();
        
        // 横梁装饰
        for (let i = 1; i <= 3; i++) {
            const y = towerBase - i * 8;
            const width = 12 - i * 2;
            ctx.beginPath();
            ctx.moveTo(towerX - width, y);
            ctx.lineTo(towerX + width, y);
            ctx.stroke();
        }
        
        // 浪漫灯光
        const sparkle = Math.sin(time * 6) > 0.5;
        if (sparkle) {
            ctx.fillStyle = 'rgba(253, 121, 168, 0.8)';
            ctx.shadowColor = '#fd79a8';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(towerX, towerBase - 50, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    drawFrenchWindows(city, cityTheme, time, ctx) {
        for (let floor = 0; floor < 3; floor++) {
            for (let window = 0; window < 3; window++) {
                const wx = city.x + 8 + window * 16;
                const wy = city.y + 8 + floor * 10;
                
                ctx.fillStyle = 'rgba(253, 203, 110, 0.3)';
                ctx.fillRect(wx, wy, 12, 8);
                
                // 小阳台
                ctx.strokeStyle = cityTheme.cityLights;
                ctx.lineWidth = 1;
                ctx.strokeRect(wx - 1, wy + 6, 14, 2);
                
                if (Math.random() > 0.4) {
                    const lightIntensity = 0.4 + 0.6 * Math.sin(time * 1.8 + floor + window);
                    ctx.fillStyle = `rgba(253, 121, 168, ${lightIntensity * 0.6})`;
                    ctx.fillRect(wx + 1, wy + 1, 10, 6);
                }
            }
        }
    }
} 