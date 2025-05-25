// 京都城市渲染器 - 古都风韵
class KyotoRenderer extends BaseCityRenderer {
    constructor() {
        super();
        this.name = '京都';
        this.nameEn = 'Kyoto';
    }
    
    render(city, index, cityTheme, time, ctx) {
        // 传统日式建筑基础
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.2));
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.2));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 清水寺风格建筑（中间城市）
        if (index === 2) {
            this.drawKiyomizuTemple(city, cityTheme, time, ctx);
        }
        
        // 传统日式屋顶
        this.drawJapaneseRoof(city, ctx);
        
        // 日式纸窗
        this.drawJapaneseWindows(city, cityTheme, time, ctx);
    }
    
    drawKiyomizuTemple(city, cityTheme, time, ctx) {
        const templeX = city.x + city.width / 2;
        const templeY = city.y;
        
        // 木质建筑结构
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(templeX - 10, templeY, 20, -25);
        
        // 多层屋顶
        ctx.fillStyle = '#654321';
        for (let level = 0; level < 3; level++) {
            const roofY = templeY - 8 - level * 6;
            const roofWidth = 24 - level * 4;
            ctx.beginPath();
            ctx.moveTo(templeX - roofWidth/2, roofY);
            ctx.lineTo(templeX + roofWidth/2, roofY);
            ctx.lineTo(templeX + roofWidth/2 - 2, roofY - 4);
            ctx.lineTo(templeX - roofWidth/2 + 2, roofY - 4);
            ctx.closePath();
            ctx.fill();
        }
        
        // 寺庙灯笼
        const lanternGlow = 0.5 + 0.5 * Math.sin(time * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${lanternGlow})`;
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 8;
        ctx.fillRect(templeX - 2, templeY - 30, 4, 6);
        ctx.shadowBlur = 0;
    }
    
    drawJapaneseRoof(city, ctx) {
        // 传统日式瓦片屋顶
        ctx.fillStyle = '#2f4f4f';
        ctx.beginPath();
        ctx.moveTo(city.x - 3, city.y);
        ctx.lineTo(city.x + city.width + 3, city.y);
        ctx.lineTo(city.x + city.width + 1, city.y - 6);
        ctx.lineTo(city.x - 1, city.y - 6);
        ctx.closePath();
        ctx.fill();
        
        // 屋顶纹理
        ctx.strokeStyle = '#1c3333';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const lineX = city.x + i * (city.width / 4);
            ctx.beginPath();
            ctx.moveTo(lineX, city.y - 6);
            ctx.lineTo(lineX, city.y);
            ctx.stroke();
        }
    }
    
    drawJapaneseWindows(city, cityTheme, time, ctx) {
        for (let i = 0; i < 3; i++) {
            const wx = city.x + 8 + i * 16;
            const wy = city.y + 8;
            
            // 纸窗背景
            ctx.fillStyle = 'rgba(255, 248, 220, 0.8)';
            ctx.fillRect(wx, wy, 12, 20);
            
            // 木质窗框
            ctx.strokeStyle = '#8b4513';
            ctx.lineWidth = 2;
            ctx.strokeRect(wx, wy, 12, 20);
            
            // 格子图案
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(wx + 4, wy);
            ctx.lineTo(wx + 4, wy + 20);
            ctx.moveTo(wx + 8, wy);
            ctx.lineTo(wx + 8, wy + 20);
            ctx.moveTo(wx, wy + 7);
            ctx.lineTo(wx + 12, wy + 7);
            ctx.moveTo(wx, wy + 13);
            ctx.lineTo(wx + 12, wy + 13);
            ctx.stroke();
            
            // 温暖的内光
            if (Math.random() > 0.3) {
                const lightIntensity = 0.4 + 0.6 * Math.sin(time * 1.5 + i);
                ctx.fillStyle = `rgba(255, 215, 0, ${lightIntensity * 0.5})`;
                ctx.fillRect(wx + 1, wy + 1, 10, 18);
            }
        }
    }
} 