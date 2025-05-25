// UI渲染模块
class UIRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
    }
    
    drawLevelCompleteMessage() {
        const ctx = this.ctx;
        
        // 背景光效
        ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // 主文字
        ctx.fillStyle = '#00ff00';
        ctx.font = GameConfig.FONTS.MEDIUM;
        ctx.textAlign = 'center';
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 20;
        ctx.fillText('关卡完成！', this.width / 2, this.height / 2 - 50);
        
        // 副文字
        ctx.font = GameConfig.FONTS.NORMAL;
        ctx.shadowBlur = 10;
        ctx.fillText('准备下一关...', this.width / 2, this.height / 2);
        ctx.shadowBlur = 0;
    }
    
    drawGameInfo(enemyMissilesSpawned, enemyMissilesToSpawn, enemyMissilesOnScreen) {
        const ctx = this.ctx;
        
        // 信息面板背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(5, 5, 300, 30);
        
        ctx.fillStyle = '#00ffff';
        ctx.font = GameConfig.FONTS.SMALL;
        ctx.textAlign = 'left';
        ctx.fillText(
            `敌方导弹: ${enemyMissilesSpawned}/${enemyMissilesToSpawn} 屏幕上: ${enemyMissilesOnScreen}`, 
            10, 25
        );
    }
    
    drawPauseScreen() {
        const ctx = this.ctx;
        
        // 模糊覆盖层效果
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // 暂停文字发光效果
        ctx.fillStyle = '#ffffff';
        ctx.font = GameConfig.FONTS.LARGE;
        ctx.textAlign = 'center';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 20;
        ctx.fillText('游戏暂停', this.width / 2, this.height / 2);
        ctx.shadowBlur = 0;
    }
    
    drawCityName(level) {
        const ctx = this.ctx;
        const cityTheme = this.getCityTheme(level);
        
        // 城市名称显示
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(this.width - 150, 5, 140, 50);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = GameConfig.FONTS.NORMAL;
        ctx.textAlign = 'center';
        ctx.shadowColor = cityTheme.cityLights;
        ctx.shadowBlur = 10;
        ctx.fillText(cityTheme.name, this.width - 80, 25);
        
        ctx.font = GameConfig.FONTS.SMALL;
        ctx.fillStyle = '#cccccc';
        ctx.shadowBlur = 5;
        ctx.fillText(cityTheme.nameEn, this.width - 80, 45);
        ctx.shadowBlur = 0;
    }
    
    getCityTheme(level) {
        const cityThemes = GameConfig.CITY_THEMES;
        const themeKeys = Object.keys(cityThemes);
        const themeIndex = ((level - 1) % themeKeys.length) + 1;
        
        return cityThemes[themeIndex] || cityThemes[1];
    }
} 