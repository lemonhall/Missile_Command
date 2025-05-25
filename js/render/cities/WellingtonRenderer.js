// 惠灵顿城市渲染器 - 新西兰之心
class WellingtonRenderer extends BaseCityRenderer {
    constructor() {
        super();
        this.name = '惠灵顿';
        this.nameEn = 'Wellington';
    }
    
    render(city, index, cityTheme, time, ctx) {
        // 新西兰风格建筑
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.4));
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.2));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 新西兰议会大楼"蜂巢"（中间城市）
        if (index === 2) {
            this.drawBeehive(city, cityTheme, time, ctx);
        }
        
        // 毛利文化装饰
        this.drawMaoriPatterns(city, cityTheme, time, ctx);
        
        // 新西兰风格窗户
        this.drawKiwiWindows(city, cityTheme, time, ctx);
    }
    
    drawBeehive(city, cityTheme, time, ctx) {
        const beehiveX = city.x + city.width / 2;
        const beehiveY = city.y;
        
        // 蜂巢建筑的独特圆形设计
        ctx.fillStyle = cityTheme.cityColor;
        
        // 建筑主体 - 圆柱形
        ctx.fillRect(beehiveX - 8, beehiveY, 16, -30);
        
        // 特色的阶梯式圆形层次
        for (let i = 0; i < 5; i++) {
            const layerY = beehiveY - 6 - i * 5;
            const layerWidth = 16 - i * 2;
            
            ctx.fillStyle = i % 2 === 0 ? 
                this.lightenColor(cityTheme.cityColor, 0.1) : 
                this.darkenColor(cityTheme.cityColor, 0.1);
            
            ctx.fillRect(beehiveX - layerWidth/2, layerY, layerWidth, 5);
        }
        
        // 顶部观景层
        ctx.fillStyle = this.lightenColor(cityTheme.cityColor, 0.3);
        ctx.fillRect(beehiveX - 6, beehiveY - 35, 12, 5);
        
        // 新西兰国旗颜色效果
        const flagGlow = Math.sin(time * 4) > 0.6;
        if (flagGlow) {
            // 蓝色和红色星星图案
            ctx.fillStyle = '#1a365d';
            ctx.shadowColor = '#1a365d';
            ctx.shadowBlur = 6;
            ctx.fillRect(beehiveX - 3, beehiveY - 38, 2, 2);
            
            ctx.fillStyle = '#c53030';
            ctx.shadowColor = '#c53030';
            ctx.shadowBlur = 6;
            ctx.fillRect(beehiveX + 1, beehiveY - 38, 2, 2);
            ctx.shadowBlur = 0;
        }
    }
    
    drawMaoriPatterns(city, cityTheme, time, ctx) {
        // 毛利传统图案（koru螺旋和其他元素）
        for (let i = 0; i < 3; i++) {
            const patternX = city.x + 8 + i * 16;
            const patternY = city.y + 8;
            
            // 自然色调背景
            ctx.fillStyle = 'rgba(0, 206, 201, 0.2)';
            ctx.fillRect(patternX, patternY, 12, 22);
            
            // 毛利传统图案
            ctx.strokeStyle = cityTheme.cityLights;
            ctx.lineWidth = 2;
            
            // Koru螺旋图案
            ctx.beginPath();
            ctx.arc(patternX + 6, patternY + 8, 4, 0, Math.PI * 1.5);
            ctx.stroke();
            
            // 内部小螺旋
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(patternX + 6, patternY + 8, 2, 0, Math.PI);
            ctx.stroke();
            
            // 自然元素装饰（蕨类植物）
            ctx.strokeStyle = '#00b894';
            ctx.lineWidth = 1;
            for (let j = 0; j < 3; j++) {
                const fernX = patternX + 2 + j * 3;
                const fernY = patternY + 15 + Math.sin(time * 2 + j) * 2;
                
                ctx.beginPath();
                ctx.moveTo(fernX, fernY);
                ctx.lineTo(fernX + 1, fernY - 3);
                ctx.lineTo(fernX + 2, fernY);
                ctx.stroke();
            }
        }
    }
    
    drawKiwiWindows(city, cityTheme, time, ctx) {
        for (let i = 0; i < 3; i++) {
            const wx = city.x + 8 + i * 16;
            const wy = city.y + 6;
            
            // 新西兰自然风格窗户
            ctx.fillStyle = 'rgba(85, 163, 255, 0.3)';
            ctx.fillRect(wx, wy, 12, 18);
            
            // 木质窗框（新西兰常见建材）
            ctx.strokeStyle = '#8b4513';
            ctx.lineWidth = 2;
            ctx.strokeRect(wx, wy, 12, 18);
            
            // 自然风格装饰
            ctx.strokeStyle = cityTheme.cityLights;
            ctx.lineWidth = 1;
            
            // 简洁的十字窗格
            ctx.beginPath();
            ctx.moveTo(wx + 6, wy);
            ctx.lineTo(wx + 6, wy + 18);
            ctx.moveTo(wx, wy + 9);
            ctx.lineTo(wx + 12, wy + 9);
            ctx.stroke();
            
            // 温暖的内光
            if (Math.random() > 0.4) {
                const lightIntensity = 0.4 + 0.6 * Math.sin(time * 1.8 + i);
                ctx.fillStyle = `rgba(253, 203, 110, ${lightIntensity * 0.8})`;
                ctx.fillRect(wx + 1, wy + 1, 10, 16);
            }
            
            // 偶尔的绿色植物反射（新西兰的绿色自然）
            if (Math.random() > 0.7) {
                ctx.fillStyle = 'rgba(0, 184, 148, 0.3)';
                ctx.fillRect(wx + 2, wy + 2, 8, 4);
            }
        }
    }
} 