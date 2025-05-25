// 深圳城市渲染器 - 现代摩天楼群
class ShenzhenRenderer extends BaseCityRenderer {
    constructor() {
        super();
        this.name = '深圳';
        this.nameEn = 'Shenzhen';
    }
    
    render(city, index, cityTheme, time, ctx) {
        // 超现代建筑
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.4));
        buildingGradient.addColorStop(0.5, cityTheme.cityColor);
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.4));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // LED屏幕效果
        this.drawLEDScreens(city, time, ctx);
        
        // 信号塔和波纹效果
        this.drawSignalTower(city, cityTheme, time, ctx);
    }
    
    drawLEDScreens(city, time, ctx) {
        for (let i = 0; i < 3; i++) {
            const screenX = city.x + 5 + i * 18;
            const screenY = city.y + 5;
            
            // 屏幕背景
            ctx.fillStyle = '#001122';
            ctx.fillRect(screenX, screenY, 15, 25);
            
            // 动态LED像素
            for (let px = 0; px < 3; px++) {
                for (let py = 0; py < 5; py++) {
                    const pixelX = screenX + 2 + px * 4;
                    const pixelY = screenY + 2 + py * 4;
                    const flicker = Math.sin(time * 5 + px + py + i) > 0.3;
                    
                    if (flicker) {
                        ctx.fillStyle = `rgba(66, 153, 225, ${0.5 + 0.5 * Math.sin(time * 3 + px + py)})`;
                        ctx.fillRect(pixelX, pixelY, 2, 2);
                    }
                }
            }
        }
    }
    
    drawSignalTower(city, cityTheme, time, ctx) {
        const antennaX = city.x + city.width / 2;
        ctx.strokeStyle = cityTheme.cityLights;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(antennaX, city.y);
        ctx.lineTo(antennaX, city.y - 20);
        ctx.stroke();
        
        const signalIntensity = Math.sin(time * 4);
        if (signalIntensity > 0.5) {
            ctx.strokeStyle = `rgba(99, 179, 237, ${signalIntensity})`;
            ctx.lineWidth = 1;
            for (let r = 5; r <= 15; r += 5) {
                ctx.beginPath();
                ctx.arc(antennaX, city.y - 20, r, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }
} 