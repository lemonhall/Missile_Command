// 伦敦城市渲染器 - 大本钟
class LondonRenderer extends BaseCityRenderer {
    constructor() {
        super();
        this.name = '伦敦';
        this.nameEn = 'London';
    }
    
    render(city, index, cityTheme, time, ctx) {
        // 维多利亚风格建筑
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.2));
        buildingGradient.addColorStop(1, cityTheme.cityColor);
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 大本钟
        if (index === 2) {
            this.drawBigBen(city, time, ctx);
        }
        
        // 传统英式窗户
        this.drawBritishWindows(city, cityTheme, time, ctx);
    }
    
    drawBigBen(city, time, ctx) {
        const clockX = city.x + city.width / 2;
        const clockY = city.y - 20;
        
        // 钟楼
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(clockX - 8, city.y, 16, -40);
        
        // 钟面
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#cccccc';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(clockX, clockY, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 钟盘边框
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(clockX, clockY, 8, 0, Math.PI * 2);
        ctx.stroke();
        
        // 动态指针
        const hours = (time % (12 * Math.PI)) / 12;
        const minutes = (time % Math.PI);
        
        // 时针
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(clockX, clockY);
        ctx.lineTo(clockX + Math.sin(hours) * 4, clockY - Math.cos(hours) * 4);
        ctx.stroke();
        
        // 分针
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(clockX, clockY);
        ctx.lineTo(clockX + Math.sin(minutes) * 6, clockY - Math.cos(minutes) * 6);
        ctx.stroke();
    }
    
    drawBritishWindows(city, cityTheme, time, ctx) {
        for (let floor = 0; floor < 3; floor++) {
            for (let window = 0; window < 4; window++) {
                const wx = city.x + 5 + window * 12;
                const wy = city.y + 5 + floor * 10;
                
                // 传统英式窗户框架
                ctx.strokeStyle = cityTheme.cityLights;
                ctx.lineWidth = 1;
                ctx.strokeRect(wx, wy, 10, 8);
                
                // 十字分格
                ctx.beginPath();
                ctx.moveTo(wx + 5, wy);
                ctx.lineTo(wx + 5, wy + 8);
                ctx.moveTo(wx, wy + 4);
                ctx.lineTo(wx + 10, wy + 4);
                ctx.stroke();
                
                // 温暖的黄光
                if (Math.random() > 0.3) {
                    const lightIntensity = 0.5 + 0.5 * Math.sin(time * 1.2 + floor + window);
                    ctx.fillStyle = `rgba(255, 215, 0, ${lightIntensity * 0.7})`;
                    ctx.fillRect(wx + 1, wy + 1, 8, 6);
                }
            }
        }
    }
} 