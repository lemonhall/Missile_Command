// 里斯本城市渲染器 - 航海之都
class LisbonRenderer extends BaseCityRenderer {
    constructor() {
        super();
        this.name = '里斯本';
        this.nameEn = 'Lisbon';
    }
    
    render(city, index, cityTheme, time, ctx) {
        // 葡萄牙建筑基础
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.3));
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.2));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 贝伦塔风格（中间城市）
        if (index === 2) {
            this.drawBelemTower(city, cityTheme, time, ctx);
        }
        
        // 葡式瓷砖装饰
        this.drawAzulejoTiles(city, cityTheme, time, ctx);
        
        // 航海主题窗户
        this.drawNauticalWindows(city, cityTheme, time, ctx);
    }
    
    drawBelemTower(city, cityTheme, time, ctx) {
        const towerX = city.x + city.width / 2;
        const towerY = city.y;
        
        // 塔楼主体
        ctx.fillStyle = this.lightenColor(cityTheme.cityColor, 0.1);
        ctx.fillRect(towerX - 8, towerY, 16, -45);
        
        // 曼努埃尔式装饰
        ctx.fillStyle = cityTheme.cityLights;
        ctx.fillRect(towerX - 10, towerY - 20, 20, 3);
        
        // 塔顶炮台
        ctx.fillStyle = this.darkenColor(cityTheme.cityColor, 0.2);
        ctx.fillRect(towerX - 6, towerY - 48, 12, 3);
        
        // 航海灯塔效果
        const beaconGlow = Math.sin(time * 4) > 0.5;
        if (beaconGlow) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 15;
            ctx.fillRect(towerX - 2, towerY - 50, 4, 3);
            ctx.shadowBlur = 0;
        }
    }
    
    drawAzulejoTiles(city, cityTheme, time, ctx) {
        // 蓝白瓷砖图案
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 4; col++) {
                const tileX = city.x + 5 + col * 12;
                const tileY = city.y + 5 + row * 10;
                
                // 瓷砖背景
                ctx.fillStyle = 'rgba(116, 185, 255, 0.3)';
                ctx.fillRect(tileX, tileY, 10, 8);
                
                // 瓷砖图案
                const pattern = (row + col) % 3;
                ctx.strokeStyle = cityTheme.cityLights;
                ctx.lineWidth = 1;
                
                if (pattern === 0) {
                    // 波浪图案
                    ctx.beginPath();
                    ctx.moveTo(tileX, tileY + 4);
                    ctx.quadraticCurveTo(tileX + 5, tileY + 2, tileX + 10, tileY + 4);
                    ctx.stroke();
                } else if (pattern === 1) {
                    // 十字图案
                    ctx.beginPath();
                    ctx.moveTo(tileX + 5, tileY);
                    ctx.lineTo(tileX + 5, tileY + 8);
                    ctx.moveTo(tileX, tileY + 4);
                    ctx.lineTo(tileX + 10, tileY + 4);
                    ctx.stroke();
                }
            }
        }
    }
    
    drawNauticalWindows(city, cityTheme, time, ctx) {
        for (let i = 0; i < 3; i++) {
            const wx = city.x + 8 + i * 16;
            const wy = city.y + 8;
            
            // 船舱窗户样式
            ctx.fillStyle = 'rgba(173, 216, 230, 0.4)';
            ctx.beginPath();
            ctx.arc(wx + 6, wy + 8, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // 窗框
            ctx.strokeStyle = cityTheme.cityLights;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(wx + 6, wy + 8, 6, 0, Math.PI * 2);
            ctx.stroke();
            
            // 航海灯光
            if (Math.random() > 0.3) {
                const lightIntensity = 0.4 + 0.6 * Math.sin(time * 1.8 + i);
                ctx.fillStyle = `rgba(253, 121, 168, ${lightIntensity * 0.7})`;
                ctx.fillRect(wx + 3, wy + 5, 6, 6);
            }
        }
    }
} 