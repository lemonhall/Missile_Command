// 导弹渲染模块
class MissileRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
    }
    
    drawPlayerMissiles(missiles, time = 0) {
        this.drawMissiles(missiles, '#00ffff', '#ffffff', '#00dddd', time);
    }
    
    drawEnemyMissiles(missiles, time = 0) {
        missiles.forEach(missile => {
            this.drawEnemyMissile(missile, time);
        });
    }
    
    drawMissiles(missiles, trailColor, missileColor, glowColor, time) {
        missiles.forEach(missile => {
            this.drawModernMissile(missile, trailColor, missileColor, glowColor, time);
        });
    }
    
    drawModernMissile(missile, trailColor, missileColor, glowColor, time) {
        const ctx = this.ctx;
        
        // 绘制发光轨迹
        if (missile.trail.length > 1) {
            for (let i = 1; i < missile.trail.length; i++) {
                const alpha = i / missile.trail.length;
                const point1 = missile.trail[i - 1];
                const point2 = missile.trail[i];
                
                // 主轨迹
                ctx.globalAlpha = alpha * 0.8;
                ctx.strokeStyle = trailColor;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(point1.x, point1.y);
                ctx.lineTo(point2.x, point2.y);
                ctx.stroke();
                
                // 发光效果
                ctx.globalAlpha = alpha * 0.4;
                ctx.strokeStyle = glowColor;
                ctx.lineWidth = 6;
                ctx.shadowColor = glowColor;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.moveTo(point1.x, point1.y);
                ctx.lineTo(point2.x, point2.y);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
            ctx.globalAlpha = 1;
        }
        
        // 绘制导弹本体
        const pulseSize = 1 + 0.3 * Math.sin(time * 20);
        
        // 导弹发光效果
        ctx.fillStyle = glowColor;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 12;
        ctx.fillRect(missile.x - 3 * pulseSize, missile.y - 3 * pulseSize, 6 * pulseSize, 6 * pulseSize);
        ctx.shadowBlur = 0;
        
        // 导弹核心
        ctx.fillStyle = missileColor;
        ctx.fillRect(missile.x - 2, missile.y - 2, 4, 4);
    }
    
    drawEnemyMissile(missile, time) {
        const ctx = this.ctx;
        
        // 使用速度向量计算导弹方向角度（这样更准确）
        const angle = Math.atan2(missile.vy, missile.vx);
        
        // 绘制威胁性轨迹
        if (missile.trail.length > 1) {
            for (let i = 1; i < missile.trail.length; i++) {
                const alpha = i / missile.trail.length;
                const point1 = missile.trail[i - 1];
                const point2 = missile.trail[i];
                
                // 主轨迹 - 更粗更明显
                ctx.globalAlpha = alpha * 0.9;
                ctx.strokeStyle = '#ff4444';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(point1.x, point1.y);
                ctx.lineTo(point2.x, point2.y);
                ctx.stroke();
                
                // 强烈发光效果
                ctx.globalAlpha = alpha * 0.6;
                ctx.strokeStyle = '#ff8888';
                ctx.lineWidth = 8;
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.moveTo(point1.x, point1.y);
                ctx.lineTo(point2.x, point2.y);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
            ctx.globalAlpha = 1;
        }
        
        // 保存当前状态
        ctx.save();
        
        // 移动到导弹位置并旋转
        ctx.translate(missile.x, missile.y);
        ctx.rotate(angle);
        
        // 绘制导弹发光外圈
        const pulseIntensity = 0.8 + 0.4 * Math.sin(time * 25);
        ctx.fillStyle = `rgba(255, 0, 0, ${pulseIntensity * 0.3})`;
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 15;
        ctx.fillRect(-8, -8, 16, 16);
        ctx.shadowBlur = 0;
        
        // 绘制导弹主体（火箭形状，头部朝右）
        ctx.fillStyle = '#cc0000';
        // 导弹头部（尖锐）
        ctx.beginPath();
        ctx.moveTo(8, 0);    // 头部尖端
        ctx.lineTo(2, -3);   // 上侧
        ctx.lineTo(-4, -2);  // 上身
        ctx.lineTo(-4, 2);   // 下身
        ctx.lineTo(2, 3);    // 下侧
        ctx.closePath();
        ctx.fill();
        
        // 导弹核心发光
        ctx.fillStyle = '#ff6666';
        ctx.beginPath();
        ctx.moveTo(6, 0);
        ctx.lineTo(0, -2);
        ctx.lineTo(-2, -1);
        ctx.lineTo(-2, 1);
        ctx.lineTo(0, 2);
        ctx.closePath();
        ctx.fill();
        
        // 导弹尾部火焰效果
        const flameLength = 8 + 4 * Math.sin(time * 30);
        const flameFlicker = 0.5 + 0.5 * Math.sin(time * 40);
        
        // 外层火焰
        ctx.fillStyle = `rgba(255, 100, 0, ${flameFlicker * 0.8})`;
        ctx.beginPath();
        ctx.moveTo(-4, 0);
        ctx.lineTo(-4 - flameLength, -4);
        ctx.lineTo(-4 - flameLength * 0.7, 0);
        ctx.lineTo(-4 - flameLength, 4);
        ctx.closePath();
        ctx.fill();
        
        // 内层火焰
        ctx.fillStyle = `rgba(255, 200, 0, ${flameFlicker})`;
        ctx.beginPath();
        ctx.moveTo(-4, 0);
        ctx.lineTo(-4 - flameLength * 0.6, -2);
        ctx.lineTo(-4 - flameLength * 0.4, 0);
        ctx.lineTo(-4 - flameLength * 0.6, 2);
        ctx.closePath();
        ctx.fill();
        
        // 导弹边框高光
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(2, -3);
        ctx.lineTo(-4, -2);
        ctx.lineTo(-4, 2);
        ctx.lineTo(2, 3);
        ctx.closePath();
        ctx.stroke();
        
        // 恢复状态
        ctx.restore();
    }
} 