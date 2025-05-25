// 东京城市渲染器 - 东京塔
class TokyoRenderer extends BaseCityRenderer {
    constructor() {
        super();
        this.name = '东京';
        this.nameEn = 'Tokyo';
    }
    
    render(city, index, cityTheme, time, ctx) {
        // 现代日式建筑
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, cityTheme.cityColor);
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.2));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 东京塔（中间城市）
        if (index === 2) {
            this.drawTokyoTower(city, time, ctx);
        }
        
        // 霓虹灯效果
        this.drawNeonLights(city, time, ctx);
    }
    
    drawTokyoTower(city, time, ctx) {
        const towerX = city.x + city.width / 2;
        const towerBase = city.y;
        
        // 塔身结构（红白相间）
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(towerX - 8, towerBase);
        ctx.lineTo(towerX + 8, towerBase);
        ctx.lineTo(towerX + 4, towerBase - 30);
        ctx.lineTo(towerX - 4, towerBase - 30);
        ctx.closePath();
        ctx.stroke();
        
        // 塔尖
        ctx.beginPath();
        ctx.moveTo(towerX, towerBase - 30);
        ctx.lineTo(towerX, towerBase - 45);
        ctx.stroke();
        
        // 横梁结构
        for (let i = 1; i <= 4; i++) {
            const y = towerBase - i * 6;
            ctx.beginPath();
            ctx.moveTo(towerX - (8 - i), y);
            ctx.lineTo(towerX + (8 - i), y);
            ctx.stroke();
        }
        
        // 塔顶灯光
        const glow = 0.5 + 0.5 * Math.sin(time * 4);
        ctx.fillStyle = `rgba(255, 255, 255, ${glow})`;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(towerX, towerBase - 45, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    drawNeonLights(city, time, ctx) {
        for (let i = 0; i < 4; i++) {
            const neonX = city.x + 8 + i * 12;
            const neonY = city.y + 8;
            
            const colors = ['#ff6b9d', '#fdcb6e', '#6c5ce7', '#a29bfe'];
            const colorIndex = (i + Math.floor(time * 2)) % colors.length;
            
            ctx.fillStyle = colors[colorIndex];
            ctx.shadowColor = colors[colorIndex];
            ctx.shadowBlur = 8;
            ctx.fillRect(neonX, neonY, 8, 20);
            ctx.shadowBlur = 0;
        }
    }
} 