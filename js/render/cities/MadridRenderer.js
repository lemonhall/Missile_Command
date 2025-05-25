// 马德里城市渲染器 - 西班牙风情
class MadridRenderer extends BaseCityRenderer {
    constructor() {
        super();
        this.name = '马德里';
        this.nameEn = 'Madrid';
    }
    
    render(city, index, cityTheme, time, ctx) {
        // 西班牙风格建筑
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.3));
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.2));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 皇宫风格建筑（中间城市）
        if (index === 2) {
            this.drawRoyalPalace(city, cityTheme, time, ctx);
        }
        
        // 西班牙瓦片屋顶
        this.drawSpanishRoof(city, ctx);
        
        // 弗拉门戈风格窗户
        this.drawFlamencoWindows(city, cityTheme, time, ctx);
    }
    
    drawRoyalPalace(city, cityTheme, time, ctx) {
        const palaceX = city.x + city.width / 2;
        const palaceY = city.y;
        
        // 宫殿主体
        ctx.fillStyle = this.lightenColor(cityTheme.cityColor, 0.2);
        ctx.fillRect(palaceX - 15, palaceY, 30, -40);
        
        // 巴洛克式装饰
        ctx.fillStyle = cityTheme.cityLights;
        for (let i = 0; i < 3; i++) {
            const decorX = palaceX - 10 + i * 10;
            ctx.fillRect(decorX, palaceY - 35, 2, 5);
        }
        
        // 西班牙式塔楼
        ctx.fillStyle = this.darkenColor(cityTheme.cityColor, 0.1);
        ctx.fillRect(palaceX - 5, palaceY - 50, 10, 10);
        
        // 王冠效果
        const crownGlow = 0.5 + 0.5 * Math.sin(time * 3);
        ctx.fillStyle = `rgba(255, 215, 0, ${crownGlow})`;
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 12;
        for (let i = 0; i < 5; i++) {
            const crownX = palaceX - 4 + i * 2;
            ctx.fillRect(crownX, palaceY - 52, 1, 3);
        }
        ctx.shadowBlur = 0;
    }
    
    drawSpanishRoof(city, ctx) {
        // 红瓦屋顶
        ctx.fillStyle = '#d63031';
        ctx.beginPath();
        ctx.moveTo(city.x - 2, city.y);
        ctx.lineTo(city.x + city.width + 2, city.y);
        ctx.lineTo(city.x + city.width, city.y - 8);
        ctx.lineTo(city.x, city.y - 8);
        ctx.closePath();
        ctx.fill();
        
        // 瓦片纹理
        ctx.strokeStyle = '#b71c1c';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const tileX = city.x + i * (city.width / 5);
            ctx.beginPath();
            ctx.arc(tileX + 6, city.y - 4, 3, Math.PI, 0, false);
            ctx.stroke();
        }
    }
    
    drawFlamencoWindows(city, cityTheme, time, ctx) {
        for (let i = 0; i < 3; i++) {
            const wx = city.x + 8 + i * 16;
            const wy = city.y + 6;
            
            // 窗户背景
            ctx.fillStyle = 'rgba(253, 203, 110, 0.4)';
            ctx.fillRect(wx, wy, 12, 22);
            
            // 铁艺阳台
            ctx.strokeStyle = '#2d3436';
            ctx.lineWidth = 2;
            ctx.strokeRect(wx - 1, wy + 18, 14, 4);
            
            // 花纹装饰
            ctx.lineWidth = 1;
            for (let j = 0; j < 3; j++) {
                ctx.beginPath();
                ctx.moveTo(wx + 2 + j * 3, wy + 18);
                ctx.lineTo(wx + 2 + j * 3, wy + 22);
                ctx.stroke();
            }
            
            // 弗拉门戈色彩光效
            const flamencoColors = ['#d63031', '#fd79a8', '#fdcb6e'];
            const colorIndex = (i + Math.floor(time * 2)) % flamencoColors.length;
            
            if (Math.random() > 0.3) {
                const lightIntensity = 0.5 + 0.5 * Math.sin(time * 2.5 + i);
                ctx.fillStyle = `${flamencoColors[colorIndex]}${Math.floor(lightIntensity * 128).toString(16).padStart(2, '0')}`;
                ctx.fillRect(wx + 1, wy + 1, 10, 20);
            }
        }
    }
} 