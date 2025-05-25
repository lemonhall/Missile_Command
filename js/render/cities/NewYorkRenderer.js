// 纽约城市渲染器 - 摩天大楼
class NewYorkRenderer extends BaseCityRenderer {
    constructor() {
        super();
        this.name = '纽约';
        this.nameEn = 'New York';
    }
    
    render(city, index, cityTheme, time, ctx) {
        // 装饰艺术风格建筑
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.2));
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.3));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 帝国大厦风格阶梯建筑
        if (index === 1 || index === 4) {
            this.drawEmpireStateBuilding(city, cityTheme, ctx);
        }
        
        // 经典美式窗户网格
        this.drawAmericanWindows(city, time, ctx);
        
        // 顶部警示灯
        this.drawWarningLight(city, time, ctx);
    }
    
    drawEmpireStateBuilding(city, cityTheme, ctx) {
        ctx.fillStyle = this.darkenColor(cityTheme.cityColor, 0.1);
        ctx.fillRect(city.x + 15, city.y - 10, 30, 10);
        ctx.fillRect(city.x + 20, city.y - 20, 20, 10);
        ctx.fillRect(city.x + 25, city.y - 30, 10, 10);
    }
    
    drawAmericanWindows(city, time, ctx) {
        for (let floor = 0; floor < 4; floor++) {
            for (let window = 0; window < 6; window++) {
                const wx = city.x + 3 + window * 9;
                const wy = city.y + 3 + floor * 8;
                
                ctx.strokeStyle = '#cccccc';
                ctx.lineWidth = 1;
                ctx.strokeRect(wx, wy, 7, 6);
                
                if (Math.random() > 0.4) {
                    const lightIntensity = 0.4 + 0.6 * Math.sin(time * 1.5 + floor + window);
                    ctx.fillStyle = `rgba(251, 182, 206, ${lightIntensity})`;
                    ctx.fillRect(wx + 1, wy + 1, 5, 4);
                }
            }
        }
    }
    
    drawWarningLight(city, time, ctx) {
        const blinkTime = Math.sin(time * 6) > 0;
        if (blinkTime) {
            ctx.fillStyle = '#ff0000';
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 8;
            ctx.fillRect(city.x + city.width / 2 - 2, city.y - 35, 4, 4);
            ctx.shadowBlur = 0;
        }
    }
} 