// 静态对象渲染模块 - 包含世界知名城市的标志性建筑
class ObjectRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
    }
    
    drawCities(cities, level = 1, time = 0) {
        const cityTheme = this.getCityTheme(level);
        
        cities.forEach((city, index) => {
            if (city.alive) {
                this.drawThemedCity(city, index, cityTheme, time, level);
            } else {
                this.drawDestroyedCity(city);
            }
        });
    }
    
    getCityTheme(level) {
        const cityThemes = GameConfig.CITY_THEMES;
        const themeKeys = Object.keys(cityThemes);
        const themeIndex = ((level - 1) % themeKeys.length) + 1;
        return cityThemes[themeIndex] || cityThemes[1];
    }
    
    drawThemedCity(city, index, cityTheme, time, level) {
        const ctx = this.ctx;
        const themeIndex = ((level - 1) % 8) + 1;
        
        // 城市基础阴影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(city.x + 3, city.y + 3, city.width, city.height);
        
        // 根据城市绘制不同的标志性建筑
        switch(themeIndex) {
            case 1: this.drawBeijingLandmarks(city, index, cityTheme, time); break;
            case 2: this.drawShanghaiLandmarks(city, index, cityTheme, time); break;
            case 3: this.drawShenzhenLandmarks(city, index, cityTheme, time); break;
            case 4: this.drawNewYorkLandmarks(city, index, cityTheme, time); break;
            case 5: this.drawTokyoLandmarks(city, index, cityTheme, time); break;
            case 6: this.drawLondonLandmarks(city, index, cityTheme, time); break;
            case 7: this.drawParisLandmarks(city, index, cityTheme, time); break;
            case 8: this.drawSydneyLandmarks(city, index, cityTheme, time); break;
            default: this.drawGenericCity(city, index, cityTheme, time);
        }
    }
    
    // 北京 - 天安门和传统建筑
    drawBeijingLandmarks(city, index, cityTheme, time) {
        const ctx = this.ctx;
        
        // 传统建筑基础
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.3));
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.2));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 传统屋顶（飞檐）
        ctx.fillStyle = '#8b0000';
        ctx.beginPath();
        ctx.moveTo(city.x - 5, city.y);
        ctx.lineTo(city.x + city.width + 5, city.y);
        ctx.lineTo(city.x + city.width, city.y - 8);
        ctx.lineTo(city.x, city.y - 8);
        ctx.closePath();
        ctx.fill();
        
        // 天安门风格门楼（中间城市）
        if (index === 2) {
            ctx.fillStyle = '#8b0000';
            ctx.fillRect(city.x + 20, city.y - 15, 20, 15);
            ctx.fillStyle = '#000';
            ctx.fillRect(city.x + 25, city.y - 10, 10, 10);
        }
        
        // 传统窗户
        for (let i = 0; i < 3; i++) {
            const wx = city.x + 8 + i * 18;
            const wy = city.y + 8;
            ctx.strokeStyle = cityTheme.cityLights;
            ctx.lineWidth = 2;
            ctx.strokeRect(wx, wy, 12, 16);
            
            const lightIntensity = 0.5 + 0.5 * Math.sin(time * 2 + index + i);
            ctx.fillStyle = `rgba(255, 215, 0, ${lightIntensity * 0.6})`;
            ctx.fillRect(wx + 1, wy + 1, 10, 14);
        }
    }
    
    // 上海 - 东方明珠塔
    drawShanghaiLandmarks(city, index, cityTheme, time) {
        const ctx = this.ctx;
        
        // 现代建筑基础
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, cityTheme.cityColor);
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.3));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 东方明珠塔（中间城市）
        if (index === 2) {
            const towerX = city.x + city.width / 2;
            const towerBase = city.y;
            
            // 塔身
            ctx.strokeStyle = cityTheme.cityLights;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(towerX, towerBase);
            ctx.lineTo(towerX, towerBase - 50);
            ctx.stroke();
            
            // 球体装饰
            const spheres = [
                { y: towerBase - 15, size: 8 },
                { y: towerBase - 35, size: 6 },
                { y: towerBase - 45, size: 4 }
            ];
            
            spheres.forEach(sphere => {
                const glow = 0.5 + 0.5 * Math.sin(time * 3);
                ctx.fillStyle = `rgba(253, 121, 168, ${glow})`;
                ctx.shadowColor = cityTheme.cityLights;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(towerX, sphere.y, sphere.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });
        }
        
        // 现代玻璃幕墙
        for (let floor = 0; floor < 4; floor++) {
            for (let window = 0; window < 4; window++) {
                const wx = city.x + 4 + window * 13;
                const wy = city.y + 4 + floor * 8;
                
                ctx.fillStyle = 'rgba(129, 236, 236, 0.3)';
                ctx.fillRect(wx, wy, 10, 6);
                
                if (Math.random() > 0.3) {
                    const lightIntensity = 0.3 + 0.7 * Math.sin(time * 2 + floor + window);
                    ctx.fillStyle = `rgba(253, 121, 168, ${lightIntensity * 0.8})`;
                    ctx.fillRect(wx + 1, wy + 1, 8, 4);
                }
            }
        }
    }
    
    // 深圳 - 现代摩天楼群
    drawShenzhenLandmarks(city, index, cityTheme, time) {
        const ctx = this.ctx;
        
        // 超现代建筑
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.4));
        buildingGradient.addColorStop(0.5, cityTheme.cityColor);
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.4));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // LED屏幕效果
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
        
        // 信号塔和波纹效果
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
    
    // 纽约 - 摩天大楼
    drawNewYorkLandmarks(city, index, cityTheme, time) {
        const ctx = this.ctx;
        
        // 装饰艺术风格建筑
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.2));
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.3));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 帝国大厦风格阶梯建筑
        if (index === 1 || index === 4) {
            ctx.fillStyle = this.darkenColor(cityTheme.cityColor, 0.1);
            ctx.fillRect(city.x + 15, city.y - 10, 30, 10);
            ctx.fillRect(city.x + 20, city.y - 20, 20, 10);
            ctx.fillRect(city.x + 25, city.y - 30, 10, 10);
        }
        
        // 经典美式窗户网格
        for (let floor = 0; floor < 4; floor++) {
            for (let window = 0; window < 6; window++) {
                const wx = city.x + 3 + window * 9;
                const wy = city.y + 3 + floor * 8;
                
                ctx.strokeStyle = '#cccccc';
                ctx.lineWidth = 1;
                ctx.strokeRect(wx, wy, 7, 6);
                
                if (Math.random() > 0.4) {
                    const lightIntensity = 0.4 + 0.6 * Math.sin(time * 1.5 + floor + window);
                    ctx.fillStyle = `rgba(251, 182, 206, ${lightIntensity})`;
                    ctx.fillRect(wx + 1, wy + 1, 5, 4);
                }
            }
        }
        
        // 顶部警示灯
        const blinkTime = Math.sin(time * 6) > 0;
        if (blinkTime) {
            ctx.fillStyle = '#ff0000';
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 8;
            ctx.fillRect(city.x + city.width / 2 - 2, city.y - 35, 4, 4);
            ctx.shadowBlur = 0;
        }
    }
    
    // 东京 - 东京塔
    drawTokyoLandmarks(city, index, cityTheme, time) {
        const ctx = this.ctx;
        
        // 现代日式建筑
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, cityTheme.cityColor);
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.2));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 东京塔（中间城市）
        if (index === 2) {
            const towerX = city.x + city.width / 2;
            const towerBase = city.y;
            
            // 塔身结构（红白相间）
            ctx.strokeStyle = '#ff4444';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(towerX - 8, towerBase);
            ctx.lineTo(towerX + 8, towerBase);
            ctx.lineTo(towerX + 4, towerBase - 30);
            ctx.lineTo(towerX - 4, towerBase - 30);
            ctx.closePath();
            ctx.stroke();
            
            // 塔尖
            ctx.beginPath();
            ctx.moveTo(towerX, towerBase - 30);
            ctx.lineTo(towerX, towerBase - 45);
            ctx.stroke();
            
            // 横梁结构
            for (let i = 1; i <= 4; i++) {
                const y = towerBase - i * 6;
                ctx.beginPath();
                ctx.moveTo(towerX - (8 - i), y);
                ctx.lineTo(towerX + (8 - i), y);
                ctx.stroke();
            }
            
            // 塔顶灯光
            const glow = 0.5 + 0.5 * Math.sin(time * 4);
            ctx.fillStyle = `rgba(255, 255, 255, ${glow})`;
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(towerX, towerBase - 45, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        // 霓虹灯效果
        for (let i = 0; i < 4; i++) {
            const neonX = city.x + 8 + i * 12;
            const neonY = city.y + 8;
            
            const colors = ['#ff6b9d', '#fdcb6e', '#6c5ce7', '#a29bfe'];
            const colorIndex = (i + Math.floor(time * 2)) % colors.length;
            
            ctx.fillStyle = colors[colorIndex];
            ctx.shadowColor = colors[colorIndex];
            ctx.shadowBlur = 8;
            ctx.fillRect(neonX, neonY, 8, 20);
            ctx.shadowBlur = 0;
        }
    }
    
    // 伦敦 - 大本钟
    drawLondonLandmarks(city, index, cityTheme, time) {
        const ctx = this.ctx;
        
        // 维多利亚风格建筑
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.1));
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.3));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 大本钟（特定城市）
        if (index === 3) {
            const clockX = city.x + city.width / 2;
            const clockBase = city.y;
            
            // 钟楼
            ctx.fillStyle = this.darkenColor(cityTheme.cityColor, 0.2);
            ctx.fillRect(clockX - 6, clockBase - 35, 12, 35);
            
            // 钟面
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = cityTheme.cityLights;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(clockX, clockBase - 30, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // 钟针
            const angle = time * 0.1;
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(clockX, clockBase - 30);
            ctx.lineTo(clockX + Math.cos(angle) * 5, clockBase - 30 + Math.sin(angle) * 5);
            ctx.stroke();
            
            // 尖顶
            ctx.fillStyle = this.darkenColor(cityTheme.cityColor, 0.4);
            ctx.beginPath();
            ctx.moveTo(clockX - 6, clockBase - 35);
            ctx.lineTo(clockX, clockBase - 45);
            ctx.lineTo(clockX + 6, clockBase - 35);
            ctx.closePath();
            ctx.fill();
        }
        
        // 传统英式窗户
        for (let floor = 0; floor < 3; floor++) {
            for (let window = 0; window < 3; window++) {
                const wx = city.x + 8 + window * 16;
                const wy = city.y + 8 + floor * 10;
                
                ctx.fillStyle = '#2d3748';
                ctx.fillRect(wx, wy, 12, 8);
                
                // 十字窗格
                ctx.strokeStyle = cityTheme.cityLights;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(wx + 6, wy);
                ctx.lineTo(wx + 6, wy + 8);
                ctx.moveTo(wx, wy + 4);
                ctx.lineTo(wx + 12, wy + 4);
                ctx.stroke();
                
                if (Math.random() > 0.3) {
                    const lightIntensity = 0.5 + 0.5 * Math.sin(time * 1.2 + floor + window);
                    ctx.fillStyle = `rgba(253, 121, 168, ${lightIntensity * 0.4})`;
                    ctx.fillRect(wx + 1, wy + 1, 10, 6);
                }
            }
        }
    }
    
    // 巴黎 - 埃菲尔铁塔
    drawParisLandmarks(city, index, cityTheme, time) {
        const ctx = this.ctx;
        
        // 法式建筑
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.2));
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.2));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 埃菲尔铁塔（中间城市）
        if (index === 2) {
            const towerX = city.x + city.width / 2;
            const towerBase = city.y;
            
            ctx.strokeStyle = '#8b7355';
            ctx.lineWidth = 2;
            
            // 底座
            ctx.beginPath();
            ctx.moveTo(towerX - 12, towerBase);
            ctx.lineTo(towerX + 12, towerBase);
            ctx.lineTo(towerX + 8, towerBase - 20);
            ctx.lineTo(towerX - 8, towerBase - 20);
            ctx.closePath();
            ctx.stroke();
            
            // 中段
            ctx.beginPath();
            ctx.moveTo(towerX - 8, towerBase - 20);
            ctx.lineTo(towerX + 8, towerBase - 20);
            ctx.lineTo(towerX + 4, towerBase - 35);
            ctx.lineTo(towerX - 4, towerBase - 35);
            ctx.closePath();
            ctx.stroke();
            
            // 塔尖
            ctx.beginPath();
            ctx.moveTo(towerX, towerBase - 35);
            ctx.lineTo(towerX, towerBase - 50);
            ctx.stroke();
            
            // 横梁装饰
            for (let i = 1; i <= 3; i++) {
                const y = towerBase - i * 8;
                const width = 12 - i * 2;
                ctx.beginPath();
                ctx.moveTo(towerX - width, y);
                ctx.lineTo(towerX + width, y);
                ctx.stroke();
            }
            
            // 浪漫灯光
            const sparkle = Math.sin(time * 6) > 0.5;
            if (sparkle) {
                ctx.fillStyle = 'rgba(253, 121, 168, 0.8)';
                ctx.shadowColor = '#fd79a8';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(towerX, towerBase - 50, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
        
        // 法式阳台窗户
        for (let floor = 0; floor < 3; floor++) {
            for (let window = 0; window < 3; window++) {
                const wx = city.x + 8 + window * 16;
                const wy = city.y + 8 + floor * 10;
                
                ctx.fillStyle = 'rgba(253, 203, 110, 0.3)';
                ctx.fillRect(wx, wy, 12, 8);
                
                // 小阳台
                ctx.strokeStyle = cityTheme.cityLights;
                ctx.lineWidth = 1;
                ctx.strokeRect(wx - 1, wy + 6, 14, 2);
                
                if (Math.random() > 0.4) {
                    const lightIntensity = 0.4 + 0.6 * Math.sin(time * 1.8 + floor + window);
                    ctx.fillStyle = `rgba(253, 121, 168, ${lightIntensity * 0.6})`;
                    ctx.fillRect(wx + 1, wy + 1, 10, 6);
                }
            }
        }
    }
    
    // 悉尼 - 悉尼歌剧院
    drawSydneyLandmarks(city, index, cityTheme, time) {
        const ctx = this.ctx;
        
        // 海港建筑
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.3));
        buildingGradient.addColorStop(1, cityTheme.cityColor);
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        // 悉尼歌剧院（特定城市）
        if (index === 1 || index === 4) {
            const operaX = city.x + city.width / 2;
            const operaBase = city.y;
            
            // 帆形屋顶
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = cityTheme.cityLights;
            ctx.shadowBlur = 8;
            
            for (let i = 0; i < 3; i++) {
                const offsetX = (i - 1) * 8;
                ctx.beginPath();
                ctx.moveTo(operaX + offsetX - 6, operaBase);
                ctx.quadraticCurveTo(operaX + offsetX, operaBase - 25, operaX + offsetX + 6, operaBase);
                ctx.fill();
            }
            ctx.shadowBlur = 0;
        }
        
        // 海港风格窗户
        for (let floor = 0; floor < 4; floor++) {
            for (let window = 0; window < 4; window++) {
                const wx = city.x + 4 + window * 13;
                const wy = city.y + 4 + floor * 8;
                
                ctx.fillStyle = 'rgba(0, 184, 148, 0.4)';
                ctx.fillRect(wx, wy, 10, 6);
                
                const waveEffect = Math.sin(time * 3 + window * 0.5 + floor * 0.3);
                if (waveEffect > 0.3) {
                    ctx.fillStyle = `rgba(116, 185, 255, ${waveEffect * 0.6})`;
                    ctx.fillRect(wx + 1, wy + 1, 8, 4);
                }
            }
        }
        
        // 灯塔效果
        const lighthouseEffect = Math.sin(time * 2) > 0.7;
        if (lighthouseEffect && index === 0) {
            ctx.strokeStyle = 'rgba(255, 234, 167, 0.8)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(city.x + city.width / 2, city.y - 10);
            ctx.lineTo(city.x + city.width / 2 + 20, city.y - 25);
            ctx.stroke();
        }
    }
    
    // 通用城市绘制
    drawGenericCity(city, index, cityTheme, time) {
        const ctx = this.ctx;
        
        const buildingGradient = ctx.createLinearGradient(city.x, city.y, city.x, city.y + city.height);
        buildingGradient.addColorStop(0, this.lightenColor(cityTheme.cityColor, 0.3));
        buildingGradient.addColorStop(0.5, cityTheme.cityColor);
        buildingGradient.addColorStop(1, this.darkenColor(cityTheme.cityColor, 0.3));
        ctx.fillStyle = buildingGradient;
        ctx.fillRect(city.x, city.y, city.width, city.height);
        
        for (let floor = 0; floor < 4; floor++) {
            for (let window = 0; window < 3; window++) {
                const wx = city.x + 8 + window * 16;
                const wy = city.y + 5 + floor * 8;
                const lightIntensity = 0.5 + 0.5 * Math.sin(time * 3 + index * 2 + floor + window);
                
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fillRect(wx, wy, 12, 6);
                
                if (Math.random() > 0.2) {
                    const lightColor = this.hexToRgb(cityTheme.cityLights);
                    ctx.fillStyle = `rgba(${lightColor.r}, ${lightColor.g}, ${lightColor.b}, ${lightIntensity * 0.8})`;
                    ctx.fillRect(wx + 1, wy + 1, 10, 4);
                }
            }
        }
    }
    
    drawDestroyedCity(city) {
        const ctx = this.ctx;
        
        ctx.fillStyle = '#333333';
        ctx.fillRect(city.x, city.y + city.height * 0.7, city.width, city.height * 0.3);
        
        ctx.fillStyle = '#666666';
        for (let i = 0; i < 5; i++) {
            const debrisX = city.x + Math.random() * city.width;
            const debrisY = city.y + city.height * 0.6 + Math.random() * city.height * 0.4;
            ctx.fillRect(debrisX, debrisY, 3, 3);
        }
    }
    
    drawLaunchPad(launchPad, time = 0) {
        const ctx = this.ctx;
        
        const baseGradient = ctx.createRadialGradient(
            launchPad.x, launchPad.y - 5, 0,
            launchPad.x, launchPad.y - 5, 20
        );
        baseGradient.addColorStop(0, '#888888');
        baseGradient.addColorStop(1, '#333333');
        
        ctx.fillStyle = baseGradient;
        ctx.fillRect(launchPad.x - 15, launchPad.y - 10, 30, 10);
        
        ctx.fillStyle = '#ff6666';
        ctx.fillRect(launchPad.x - 5, launchPad.y - 20, 10, 10);
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        ctx.strokeRect(launchPad.x - 15, launchPad.y - 10, 30, 10);
        ctx.strokeRect(launchPad.x - 5, launchPad.y - 20, 10, 10);
        ctx.globalAlpha = 1;
        
        const statusBlink = Math.sin(time * 6) > 0;
        if (statusBlink) {
            ctx.fillStyle = '#00ff00';
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 8;
            ctx.fillRect(launchPad.x - 2, launchPad.y - 25, 4, 2);
            ctx.shadowBlur = 0;
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