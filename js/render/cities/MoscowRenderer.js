// 莫斯科城市渲染器 - 红场风情
class MoscowRenderer extends BaseCityRenderer {
    constructor() {
        super();
        this.name = '莫斯科';
        this.nameEn = 'Moscow';
    }
    
    render(city, index, cityTheme, time, ctx) {
        // 俄式建筑基础
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.2));
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.3));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 圣瓦西里大教堂风格（中间城市）
        if (index === 2) {
            this.drawStBasilsCathedral(city, cityTheme, time, ctx);
        }
        
        // 洋葱头圆顶
        this.drawOnionDomes(city, cityTheme, time, ctx);
        
        // 俄式窗户
        this.drawRussianWindows(city, cityTheme, time, ctx);
    }
    
    drawStBasilsCathedral(city, cityTheme, time, ctx) {
        const cathedralX = city.x + city.width / 2;
        const cathedralY = city.y;
        
        // 主塔身
        ctx.fillStyle = cityTheme.cityColor;
        ctx.fillRect(cathedralX - 8, cathedralY, 16, -35);
        
        // 多彩洋葱头圆顶
        const domeColors = ['#d63031', '#00b894', '#fdcb6e', '#0984e3'];
        for (let i = 0; i < 4; i++) {
            const domeX = cathedralX - 6 + i * 4;
            const domeY = cathedralY - 35 - i * 2;
            
            ctx.fillStyle = domeColors[i];
            ctx.shadowColor = domeColors[i];
            ctx.shadowBlur = 8;
            
            // 洋葱头形状
            ctx.beginPath();
            ctx.ellipse(domeX, domeY, 3, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 十字架
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(domeX - 0.5, domeY - 8, 1, 4);
            ctx.fillRect(domeX - 1.5, domeY - 7, 3, 1);
        }
        ctx.shadowBlur = 0;
        
        // 雪花效果（冬日莫斯科）
        if (Math.sin(time * 2) > 0.5) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            for (let i = 0; i < 5; i++) {
                const snowX = cathedralX - 10 + Math.random() * 20;
                const snowY = cathedralY - 50 + Math.random() * 10;
                ctx.fillRect(snowX, snowY, 1, 1);
            }
        }
    }
    
    drawOnionDomes(city, cityTheme, time, ctx) {
        for (let i = 0; i < 3; i++) {
            const domeX = city.x + 10 + i * 20;
            const domeY = city.y - 8;
            
            // 洋葱头圆顶
            ctx.fillStyle = cityTheme.cityLights;
            ctx.shadowColor = cityTheme.cityLights;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.ellipse(domeX, domeY, 4, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // 金色十字架
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(domeX - 0.5, domeY - 10, 1, 3);
            ctx.fillRect(domeX - 1, domeY - 9, 2, 1);
        }
    }
    
    drawRussianWindows(city, cityTheme, time, ctx) {
        for (let floor = 0; floor < 3; floor++) {
            for (let window = 0; window < 4; window++) {
                const wx = city.x + 5 + window * 12;
                const wy = city.y + 5 + floor * 10;
                
                // 窗户框架
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(wx, wy, 10, 8);
                
                // 俄式装饰边框
                ctx.strokeStyle = cityTheme.cityLights;
                ctx.lineWidth = 2;
                ctx.strokeRect(wx, wy, 10, 8);
                
                // 窗格
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(wx + 5, wy);
                ctx.lineTo(wx + 5, wy + 8);
                ctx.moveTo(wx, wy + 4);
                ctx.lineTo(wx + 10, wy + 4);
                ctx.stroke();
                
                // 温暖的橙色光线
                if (Math.random() > 0.2) {
                    const lightIntensity = 0.5 + 0.5 * Math.sin(time * 1.8 + floor + window);
                    ctx.fillStyle = `rgba(255, 215, 0, ${lightIntensity * 0.6})`;
                    ctx.fillRect(wx + 1, wy + 1, 8, 6);
                }
            }
        }
    }
} 