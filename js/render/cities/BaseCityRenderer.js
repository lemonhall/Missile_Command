// 城市渲染器基类
class BaseCityRenderer {
    constructor() {
        this.name = 'Unknown';
        this.nameEn = 'Unknown';
    }
    
    // 每个城市都必须实现的主渲染方法
    render(city, index, cityTheme, time, ctx) {
        throw new Error('City renderer must implement render method');
    }
    
    // 通用的建筑基础绘制
    drawBuildingBase(city, cityTheme, ctx) {
        // 城市基础阴影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(city.x + 3, city.y + 3, city.width, city.height);
        
        // 主建筑渐变
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.3));
        buildingGradient.addColorStop(0.5, cityTheme.cityColor);
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.3));
        
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
    }
    
    // 通用的窗户绘制
    drawBasicWindows(city, cityTheme, time, index, ctx, rows = 4, cols = 3) {
        for (let floor = 0; floor < rows; floor++) {
            for (let window = 0; window < cols; window++) {
                const wx = city.x + 8 + window * 16;
                const wy = city.y + 5 + floor * 8;
                const lightIntensity = 0.5 + 0.5 * Math.sin(time * 3 + index * 2 + floor + window);
                
                // 窗户背景
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fillRect(wx, wy, 12, 6);
                
                // 窗户光效
                if (Math.random() > 0.2) {
                    const lightColor = this.hexToRgb(cityTheme.cityLights);
                    ctx.fillStyle = `rgba(${lightColor.r}, ${lightColor.g}, ${lightColor.b}, ${lightIntensity * 0.8})`;
                    ctx.fillRect(wx + 1, wy + 1, 10, 4);
                }
            }
        }
    }
    
    // 颜色处理辅助函数
    darkenColor(color, factor) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const newR = Math.floor(r * (1 - factor));
        const newG = Math.floor(g * (1 - factor));
        const newB = Math.floor(b * (1 - factor));
        
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    
    lightenColor(color, factor) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const newR = Math.min(255, Math.floor(r + (255 - r) * factor));
        const newG = Math.min(255, Math.floor(g + (255 - g) * factor));
        const newB = Math.min(255, Math.floor(b + (255 - b) * factor));
        
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r: 255, g: 255, b: 255};
    }
} 