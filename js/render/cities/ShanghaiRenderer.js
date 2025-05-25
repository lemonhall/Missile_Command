// 上海城市渲染器 - 东方明珠塔
class ShanghaiRenderer extends BaseCityRenderer {
    constructor() {
        super();
        this.name = '上海';
        this.nameEn = 'Shanghai';
    }
    
    render(city, index, cityTheme, time, ctx) {
        // 现代建筑基础
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, cityTheme.cityColor);
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.3));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 东方明珠塔（中间城市）
        if (index === 2) {
            this.drawOrientalPearlTower(city, cityTheme, time, ctx);
        }
        
        // 现代化玻璃幕墙
        this.drawModernGlassWalls(city, time, ctx);
    }
    
    drawOrientalPearlTower(city, cityTheme, time, ctx) {
        const towerX = city.x + city.width / 2;
        const towerBase = city.y;
        
        // 塔身
        ctx.strokeStyle = cityTheme.cityLights;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(towerX, towerBase);
        ctx.lineTo(towerX, towerBase - 50);
        ctx.stroke();
        
        // 球体装饰
        const spheres = [
            { y: towerBase - 15, size: 8 },
            { y: towerBase - 35, size: 6 },
            { y: towerBase - 45, size: 4 }
        ];
        
        spheres.forEach(sphere => {
            const glow = 0.5 + 0.5 * Math.sin(time * 3);
            ctx.fillStyle = `rgba(253, 121, 168, ${glow})`;
            ctx.shadowColor = cityTheme.cityLights;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(towerX, sphere.y, sphere.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    }
    
    drawModernGlassWalls(city, time, ctx) {
        for (let floor = 0; floor < 4; floor++) {
            for (let window = 0; window < 4; window++) {
                const wx = city.x + 4 + window * 13;
                const wy = city.y + 4 + floor * 8;
                
                ctx.fillStyle = 'rgba(129, 236, 236, 0.3)';
                ctx.fillRect(wx, wy, 10, 6);
                
                if (Math.random() > 0.3) {
                    const lightIntensity = 0.3 + 0.7 * Math.sin(time * 2 + floor + window);
                    ctx.fillStyle = `rgba(253, 121, 168, ${lightIntensity * 0.8})`;
                    ctx.fillRect(wx + 1, wy + 1, 8, 4);
                }
            }
        }
    }
} 