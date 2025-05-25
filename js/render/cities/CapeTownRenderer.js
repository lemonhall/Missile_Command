// 开普敦城市渲染器 - 非洲之星
class CapeTownRenderer extends BaseCityRenderer {
    constructor() {
        super();
        this.name = '开普敦';
        this.nameEn = 'Cape Town';
    }
    
    render(city, index, cityTheme, time, ctx) {
        // 非洲风格建筑
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.4));
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.2));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 桌山轮廓（中间城市）
        if (index === 2) {
            this.drawTableMountain(city, cityTheme, time, ctx);
        }
        
        // 非洲传统图案装饰
        this.drawAfricanPatterns(city, cityTheme, time, ctx);
        
        // 南非风格窗户
        this.drawSouthAfricanWindows(city, cityTheme, time, ctx);
    }
    
    drawTableMountain(city, cityTheme, time, ctx) {
        const mountainX = city.x + city.width / 2;
        const mountainY = city.y;
        
        // 桌山的平顶山形
        ctx.fillStyle = '#8b4513';
        ctx.beginPath();
        ctx.moveTo(mountainX - 18, mountainY);
        ctx.lineTo(mountainX - 15, mountainY - 25);
        ctx.lineTo(mountainX - 5, mountainY - 35);
        ctx.lineTo(mountainX + 5, mountainY - 35);
        ctx.lineTo(mountainX + 15, mountainY - 25);
        ctx.lineTo(mountainX + 18, mountainY);
        ctx.closePath();
        ctx.fill();
        
        // 桌山顶部（特有的平顶）
        ctx.fillStyle = this.darkenColor('#8b4513', 0.2);
        ctx.fillRect(mountainX - 5, mountainY - 35, 10, 3);
        
        // 山体阴影和纹理
        ctx.fillStyle = this.darkenColor('#8b4513', 0.4);
        for (let i = 0; i < 3; i++) {
            const ridgeX = mountainX - 12 + i * 8;
            ctx.beginPath();
            ctx.moveTo(ridgeX, mountainY - 10 - i * 5);
            ctx.lineTo(ridgeX + 3, mountainY - 15 - i * 5);
            ctx.lineTo(ridgeX + 6, mountainY - 10 - i * 5);
            ctx.fill();
        }
        
        // 云层效果（桌山著名的"桌布云"）
        const cloudGlow = 0.3 + 0.7 * Math.sin(time * 1.5);
        ctx.fillStyle = `rgba(255, 255, 255, ${cloudGlow * 0.6})`;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 12;
        
        for (let i = 0; i < 4; i++) {
            const cloudX = mountainX - 8 + i * 4;
            const cloudY = mountainY - 38 + Math.sin(time * 2 + i) * 2;
            ctx.beginPath();
            ctx.arc(cloudX, cloudY, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.shadowBlur = 0;
    }
    
    drawAfricanPatterns(city, cityTheme, time, ctx) {
        // 非洲传统几何图案
        for (let i = 0; i < 3; i++) {
            const patternX = city.x + 8 + i * 16;
            const patternY = city.y + 5;
            
            // 几何图案背景
            ctx.fillStyle = 'rgba(0, 184, 148, 0.3)';
            ctx.fillRect(patternX, patternY, 12, 25);
            
            // 传统非洲图案
            ctx.strokeStyle = cityTheme.cityLights;
            ctx.lineWidth = 2;
            
            // 菱形图案
            ctx.beginPath();
            ctx.moveTo(patternX + 6, patternY + 2);
            ctx.lineTo(patternX + 10, patternY + 8);
            ctx.lineTo(patternX + 6, patternY + 14);
            ctx.lineTo(patternX + 2, patternY + 8);
            ctx.closePath();
            ctx.stroke();
            
            // 锯齿图案
            ctx.beginPath();
            for (let j = 0; j < 4; j++) {
                const zigX = patternX + 2 + j * 2;
                const zigY1 = patternY + 16 + (j % 2) * 3;
                const zigY2 = patternY + 19 - (j % 2) * 3;
                if (j === 0) ctx.moveTo(zigX, zigY1);
                ctx.lineTo(zigX, zigY2);
                ctx.lineTo(zigX + 2, zigY1);
            }
            ctx.stroke();
        }
    }
    
    drawSouthAfricanWindows(city, cityTheme, time, ctx) {
        for (let i = 0; i < 3; i++) {
            const wx = city.x + 8 + i * 16;
            const wy = city.y + 8;
            
            // 窗户背景 - 暖色调
            ctx.fillStyle = 'rgba(253, 203, 110, 0.4)';
            ctx.fillRect(wx, wy, 12, 20);
            
            // 传统窗框装饰
            ctx.strokeStyle = cityTheme.cityLights;
            ctx.lineWidth = 2;
            ctx.strokeRect(wx, wy, 12, 20);
            
            // 彩色玻璃效果（受非洲艺术启发）
            const africaColors = ['#e17055', '#fdcb6e', '#00b894'];
            const colorIndex = (i + Math.floor(time * 1.5)) % africaColors.length;
            
            if (Math.random() > 0.3) {
                const lightIntensity = 0.5 + 0.5 * Math.sin(time * 2.2 + i);
                ctx.fillStyle = `${africaColors[colorIndex]}${Math.floor(lightIntensity * 180).toString(16).padStart(2, '0')}`;
                ctx.fillRect(wx + 2, wy + 2, 8, 16);
            }
            
            // 部族图案装饰
            ctx.strokeStyle = this.darkenColor(cityTheme.cityLights, 0.3);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(wx + 6, wy);
            ctx.lineTo(wx + 6, wy + 20);
            ctx.moveTo(wx, wy + 10);
            ctx.lineTo(wx + 12, wy + 10);
            ctx.stroke();
        }
    }
} 