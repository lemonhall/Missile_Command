// 悉尼城市渲染器 - 悉尼歌剧院
class SydneyRenderer extends BaseCityRenderer {
    constructor() {
        super();
        this.name = '悉尼';
        this.nameEn = 'Sydney';
    }
    
    render(city, index, cityTheme, time, ctx) {
        // 现代海港城市建筑
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.3));
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.2));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 悉尼歌剧院
        if (index === 2) {
            this.drawOperaHouse(city, time, ctx);
        }
        
        // 海港灯塔
        this.drawHarborLights(city, cityTheme, time, index, ctx);
    }
    
    drawOperaHouse(city, time, ctx) {
        const operaX = city.x + city.width / 2;
        const operaY = city.y;
        
        ctx.fillStyle = '#f0f0f0';
        ctx.shadowColor = '#cccccc';
        ctx.shadowBlur = 8;
        
        // 帆状屋顶
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(operaX - 15 + i * 6, operaY);
            ctx.quadraticCurveTo(operaX - 10 + i * 6, operaY - 25, operaX - 5 + i * 6, operaY - 10);
            ctx.quadraticCurveTo(operaX + i * 6, operaY - 30, operaX + 5 + i * 6, operaY);
            ctx.fill();
        }
        ctx.shadowBlur = 0;
        
        // 屋顶光效
        const shimmer = 0.3 + 0.7 * Math.sin(time * 2);
        ctx.fillStyle = `rgba(173, 216, 230, ${shimmer})`;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(operaX - 12 + i * 6, operaY - 2);
            ctx.quadraticCurveTo(operaX - 8 + i * 6, operaY - 20, operaX - 3 + i * 6, operaY - 8);
            ctx.quadraticCurveTo(operaX + 2 + i * 6, operaY - 25, operaX + 7 + i * 6, operaY - 2);
            ctx.fill();
        }
    }
    
    drawHarborLights(city, cityTheme, time, index, ctx) {
        for (let i = 0; i < 3; i++) {
            const lightX = city.x + 10 + i * 20;
            const lightY = city.y + 10;
            
            // 灯塔样式窗户
            ctx.fillStyle = 'rgba(173, 216, 230, 0.4)';
            ctx.fillRect(lightX, lightY, 12, 20);
            
            // 海港灯光
            const harborLight = 0.4 + 0.6 * Math.sin(time * 2.5 + i + index);
            ctx.fillStyle = `rgba(144, 202, 249, ${harborLight})`;
            ctx.shadowColor = 'rgba(144, 202, 249, 0.6)';
            ctx.shadowBlur = 10;
            ctx.fillRect(lightX + 1, lightY + 1, 10, 18);
            ctx.shadowBlur = 0;
        }
        
        // 港口信号灯
        const beacon = Math.sin(time * 5) > 0.7;
        if (beacon) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 15;
            ctx.fillRect(city.x + city.width - 5, city.y - 10, 3, 3);
            ctx.shadowBlur = 0;
        }
    }
} 