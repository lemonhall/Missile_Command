// 特效渲染模块
class EffectRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
    }
    
    drawExplosions(explosions, time = 0) {
        explosions.forEach(explosion => {
            this.drawModernExplosion(explosion, time);
        });
    }
    
    drawModernExplosion(explosion, time) {
        const ctx = this.ctx;
        const alpha = explosion.getAlpha();
        const radius = explosion.radius;
        
        // 冲击波环
        ctx.globalAlpha = alpha * 0.3;
        ctx.strokeStyle = explosion.type === 'enemy' ? '#ff6666' : '#ffff66';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, radius * 1.2, 0, Math.PI * 2);
        ctx.stroke();
        
        // 外层光晕
        const outerGradient = ctx.createRadialGradient(
            explosion.x, explosion.y, 0,
            explosion.x, explosion.y, radius
        );
        outerGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`);
        outerGradient.addColorStop(0.3, explosion.type === 'enemy' ? 
            `rgba(255, 100, 100, ${alpha * 0.6})` : 
            `rgba(255, 255, 100, ${alpha * 0.6})`);
        outerGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        
        ctx.globalAlpha = alpha * 0.7;
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 内层核心
        const coreGradient = ctx.createRadialGradient(
            explosion.x, explosion.y, 0,
            explosion.x, explosion.y, radius * 0.5
        );
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        coreGradient.addColorStop(0.7, `rgba(255, 255, 200, ${alpha * 0.8})`);
        coreGradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // 火花效果
        ctx.globalAlpha = alpha * 0.8;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + time * 2;
            const sparkX = explosion.x + Math.cos(angle) * radius * 0.8;
            const sparkY = explosion.y + Math.sin(angle) * radius * 0.8;
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(sparkX - 1, sparkY - 1, 2, 2);
        }
        
        ctx.globalAlpha = 1;
    }
    
    drawParticles(particles) {
        particles.forEach(particle => {
            const ctx = this.ctx;
            const alpha = particle.getAlpha();
            
            // 粒子发光效果
            ctx.globalAlpha = alpha * 0.8;
            ctx.fillStyle = particle.color;
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 4;
            ctx.fillRect(particle.x - 1.5, particle.y - 1.5, 3, 3);
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        });
    }
} 