// 新德里城市渲染器 - 印度门
class NewDelhiRenderer extends BaseCityRenderer {
    constructor() {
        super();
        this.name = '新德里';
        this.nameEn = 'New Delhi';
    }
    
    render(city, index, cityTheme, time, ctx) {
        // 莫卧儿风格建筑
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.3));
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.2));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 印度门（中间城市）
        if (index === 2) {
            this.drawIndiaGate(city, cityTheme, time, ctx);
        }
        
        // 莫卧儿圆顶
        this.drawMughalDomes(city, cityTheme, ctx);
        
        // 印度风格窗户
        this.drawIndianWindows(city, cityTheme, time, ctx);
    }
    
    drawIndiaGate(city, cityTheme, time, ctx) {
        const gateX = city.x + city.width / 2;
        const gateY = city.y;
        
        // 门基座
        ctx.fillStyle = this.darkenColor(cityTheme.cityColor, 0.2);
        ctx.fillRect(gateX - 12, gateY, 24, -30);
        
        // 拱门
        ctx.fillStyle = this.lightenColor(cityTheme.cityColor, 0.1);
        ctx.beginPath();
        ctx.arc(gateX, gateY - 10, 8, 0, Math.PI, true);
        ctx.fill();
        
        // 顶部尖塔
        ctx.fillStyle = cityTheme.cityColor;
        ctx.beginPath();
        ctx.moveTo(gateX - 4, gateY - 30);
        ctx.lineTo(gateX + 4, gateY - 30);
        ctx.lineTo(gateX, gateY - 45);
        ctx.closePath();
        ctx.fill();
        
        // 永恒之火效果
        const flameFlicker = Math.sin(time * 8) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 140, 0, ${0.6 + flameFlicker * 0.4})`;
        ctx.shadowColor = '#ff8c00';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(gateX, gateY - 15, 2 + flameFlicker, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    drawMughalDomes(city, cityTheme, ctx) {
        // 传统圆顶
        ctx.fillStyle = cityTheme.cityLights;
        ctx.shadowColor = cityTheme.cityLights;
        ctx.shadowBlur = 5;
        
        for (let i = 0; i < 2; i++) {
            const domeX = city.x + 15 + i * 30;
            const domeY = city.y - 5;
            
            ctx.beginPath();
            ctx.arc(domeX, domeY, 6, 0, Math.PI, true);
            ctx.fill();
            
            // 尖塔
            ctx.fillRect(domeX - 1, domeY - 6, 2, -8);
        }
        ctx.shadowBlur = 0;
    }
    
    drawIndianWindows(city, cityTheme, time, ctx) {
        for (let i = 0; i < 4; i++) {
            const wx = city.x + 5 + i * 12;
            const wy = city.y + 8;
            
            // 拱形窗户背景
            ctx.fillStyle = 'rgba(253, 203, 110, 0.4)';
            ctx.fillRect(wx, wy, 10, 16);
            
            // 拱形窗户顶部
            ctx.beginPath();
            ctx.arc(wx + 5, wy, 5, 0, Math.PI, true);
            ctx.fill();
            
            // 装饰边框
            ctx.strokeStyle = cityTheme.cityLights;
            ctx.lineWidth = 1;
            ctx.strokeRect(wx, wy, 10, 16);
            ctx.beginPath();
            ctx.arc(wx + 5, wy, 5, 0, Math.PI, true);
            ctx.stroke();
            
            // 印度式装饰图案
            if (Math.random() > 0.3) {
                const lightIntensity = 0.5 + 0.5 * Math.sin(time * 2 + i);
                ctx.fillStyle = `rgba(253, 121, 168, ${lightIntensity * 0.7})`;
                ctx.fillRect(wx + 2, wy + 2, 6, 12);
            }
        }
    }
} 