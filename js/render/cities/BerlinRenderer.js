// 柏林城市渲染器 - 现代之都
class BerlinRenderer extends BaseCityRenderer {
    constructor() {
        super();
        this.name = '柏林';
        this.nameEn = 'Berlin';
    }
    
    render(city, index, cityTheme, time, ctx) {
        // 现代德式建筑
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.3));
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.2));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 勃兰登堡门（中间城市）
        if (index === 2) {
            this.drawBrandenburgGate(city, cityTheme, time, ctx);
        }
        
        // 现代德式玻璃建筑
        this.drawModernGermanArchitecture(city, cityTheme, time, ctx);
        
        // 德式窗户设计
        this.drawGermanWindows(city, cityTheme, time, ctx);
    }
    
    drawBrandenburgGate(city, cityTheme, time, ctx) {
        const gateX = city.x + city.width / 2;
        const gateY = city.y;
        
        // 门的基座
        ctx.fillStyle = this.lightenColor(cityTheme.cityColor, 0.1);
        ctx.fillRect(gateX - 15, gateY, 30, -30);
        
        // 古典柱廊
        ctx.fillStyle = this.darkenColor(cityTheme.cityColor, 0.1);
        for (let i = 0; i < 5; i++) {
            const columnX = gateX - 12 + i * 6;
            ctx.fillRect(columnX, gateY, 2, -30);
        }
        
        // 顶部装饰
        ctx.fillStyle = cityTheme.cityLights;
        ctx.fillRect(gateX - 16, gateY - 30, 32, 4);
        
        // 胜利女神四马战车（Quadriga）
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 8;
        
        // 简化的四马战车轮廓
        for (let i = 0; i < 4; i++) {
            const horseX = gateX - 6 + i * 3;
            ctx.fillRect(horseX, gateY - 38, 2, 6);
        }
        
        // 女神和战车
        ctx.fillRect(gateX - 2, gateY - 42, 4, 8);
        ctx.shadowBlur = 0;
        
        // 德国国旗色彩光效
        const flagGlow = Math.sin(time * 3) > 0.3;
        if (flagGlow) {
            const flagColors = ['#000000', '#ff0000', '#ffff00'];
            flagColors.forEach((color, index) => {
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.3;
                ctx.fillRect(gateX - 8 + index * 5, gateY - 32, 4, 2);
                ctx.globalAlpha = 1;
            });
        }
    }
    
    drawModernGermanArchitecture(city, cityTheme, time, ctx) {
        // 现代德式建筑特色 - 几何简洁线条
        for (let i = 0; i < 3; i++) {
            const moduleX = city.x + 5 + i * 18;
            const moduleY = city.y + 5;
            
            // 几何模块化设计
            ctx.strokeStyle = cityTheme.cityLights;
            ctx.lineWidth = 2;
            ctx.strokeRect(moduleX, moduleY, 16, 25);
            
            // 内部分割线（德式简约）
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(moduleX + 8, moduleY);
            ctx.lineTo(moduleX + 8, moduleY + 25);
            ctx.moveTo(moduleX, moduleY + 12);
            ctx.lineTo(moduleX + 16, moduleY + 12);
            ctx.stroke();
        }
    }
    
    drawGermanWindows(city, cityTheme, time, ctx) {
        for (let floor = 0; floor < 3; floor++) {
            for (let window = 0; window < 4; window++) {
                const wx = city.x + 6 + window * 12;
                const wy = city.y + 6 + floor * 10;
                
                // 德式窗户 - 精密工艺感
                ctx.fillStyle = 'rgba(162, 155, 254, 0.3)';
                ctx.fillRect(wx, wy, 10, 8);
                
                // 精密窗框
                ctx.strokeStyle = cityTheme.cityLights;
                ctx.lineWidth = 1;
                ctx.strokeRect(wx, wy, 10, 8);
                
                // 德式窗格（十字分割）
                ctx.beginPath();
                ctx.moveTo(wx + 5, wy);
                ctx.lineTo(wx + 5, wy + 8);
                ctx.moveTo(wx, wy + 4);
                ctx.lineTo(wx + 10, wy + 4);
                ctx.stroke();
                
                // 现代化内光
                if (Math.random() > 0.3) {
                    const lightIntensity = 0.4 + 0.6 * Math.sin(time * 2 + floor + window);
                    ctx.fillStyle = `rgba(253, 121, 168, ${lightIntensity * 0.7})`;
                    ctx.fillRect(wx + 1, wy + 1, 8, 6);
                }
            }
        }
    }
} 