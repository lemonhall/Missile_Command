// 新加坡城市渲染器 - 狮城明珠
class SingaporeRenderer extends BaseCityRenderer {
    constructor() {
        super();
        this.name = '新加坡';
        this.nameEn = 'Singapore';
    }
    
    render(city, index, cityTheme, time, ctx) {
        // 现代热带建筑
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.4));
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.2));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 滨海湾金沙（中间城市）
        if (index === 2) {
            this.drawMarinaBaySands(city, cityTheme, time, ctx);
        }
        
        // 现代玻璃幕墙
        this.drawModernGlass(city, cityTheme, time, ctx);
        
        // 热带植物装饰
        this.drawTropicalAccents(city, time, ctx);
    }
    
    drawMarinaBaySands(city, cityTheme, time, ctx) {
        const sands = city.x + city.width / 2;
        const sandsY = city.y;
        
        // 三座塔楼
        ctx.fillStyle = cityTheme.cityColor;
        for (let i = 0; i < 3; i++) {
            const towerX = sands - 12 + i * 8;
            ctx.fillRect(towerX, sandsY, 6, -35);
        }
        
        // 天空花园
        ctx.fillStyle = this.lightenColor(cityTheme.cityColor, 0.3);
        ctx.fillRect(sands - 15, sandsY - 35, 30, 4);
        
        // 无边泳池效果
        const poolGlow = 0.3 + 0.7 * Math.sin(time * 1.5);
        ctx.fillStyle = `rgba(129, 236, 236, ${poolGlow})`;
        ctx.shadowColor = '#81ecec';
        ctx.shadowBlur = 8;
        ctx.fillRect(sands - 14, sandsY - 36, 28, 2);
        ctx.shadowBlur = 0;
        
        // 顶部花园
        ctx.fillStyle = '#00b894';
        for (let i = 0; i < 5; i++) {
            const plantX = sands - 12 + i * 6;
            ctx.fillRect(plantX, sandsY - 40, 2, 4);
        }
    }
    
    drawModernGlass(city, cityTheme, time, ctx) {
        for (let floor = 0; floor < 4; floor++) {
            for (let panel = 0; panel < 4; panel++) {
                const px = city.x + 5 + panel * 12;
                const py = city.y + 4 + floor * 8;
                
                // 玻璃幕墙反射
                const reflection = 0.2 + 0.8 * Math.sin(time * 1.2 + floor + panel);
                ctx.fillStyle = `rgba(129, 236, 236, ${reflection * 0.4})`;
                ctx.fillRect(px, py, 10, 6);
                
                // 建筑内光
                if (Math.random() > 0.4) {
                    const lightIntensity = 0.3 + 0.7 * Math.sin(time * 2.5 + floor + panel);
                    ctx.fillStyle = `rgba(253, 121, 168, ${lightIntensity * 0.6})`;
                    ctx.fillRect(px + 1, py + 1, 8, 4);
                }
            }
        }
    }
    
    drawTropicalAccents(city, time, ctx) {
        // 热带植物装饰
        ctx.fillStyle = '#00b894';
        for (let i = 0; i < 3; i++) {
            const plantX = city.x + 8 + i * 20;
            const plantY = city.y + city.height - 5;
            
            // 棕榈叶效果
            const sway = Math.sin(time * 2 + i) * 2;
            ctx.save();
            ctx.translate(plantX, plantY);
            ctx.rotate(sway * 0.1);
            ctx.fillRect(-1, 0, 2, -8);
            ctx.restore();
        }
    }
} 