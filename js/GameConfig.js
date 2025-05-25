// 游戏配置和常量
const GameConfig = {
    // 画布设置
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    
    // 游戏设置
    GROUND_LEVEL_OFFSET: 80,
    CITY_COUNT: 6,
    CITY_WIDTH: 60,
    CITY_HEIGHT: 40,
    
    // 导弹设置
    PLAYER_MISSILE_SPEED: 300,
    PLAYER_MISSILE_LIMIT: 3,
    PLAYER_MISSILE_TRAIL_LENGTH: 10,
    
    // 敌方导弹设置
    ENEMY_MISSILE_BASE_SPEED: 25,
    ENEMY_MISSILE_SPEED_INCREMENT: 3,
    ENEMY_MISSILE_MAX_SPEED: 55,
    ENEMY_MISSILE_TRAIL_LENGTH: 8,
    ENEMY_MISSILE_BASE_COUNT: 6,
    ENEMY_MISSILE_COUNT_INCREMENT: 1,
    ENEMY_MISSILE_MAX_COUNT: 16,
    
    // 生成时间设置
    ENEMY_SPAWN_BASE_RATE: 2000,
    ENEMY_SPAWN_RATE_DECREMENT: 100,
    ENEMY_SPAWN_MIN_RATE: 600,
    ENEMY_SPAWN_RANDOM_DELAY: 800,
    
    // 爆炸设置
    PLAYER_EXPLOSION_RADIUS: 60,
    ENEMY_EXPLOSION_RADIUS: 40,
    EXPLOSION_DURATION: 1500,
    EXPLOSION_DETECTION_DISTANCE: 20,
    
    // 粒子设置
    PARTICLE_COUNT_PER_EXPLOSION: 15,
    PARTICLE_SPEED_RANGE: 200,
    PARTICLE_BASE_LIFE: 1000,
    PARTICLE_LIFE_RANGE: 500,
    
    // 计分设置
    SCORE_PER_ENEMY_MISSILE: 25,
    SCORE_PER_CITY_BONUS: 100,
    
    // 时间设置
    LEVEL_COMPLETE_DELAY: 2000,
    NEXT_LEVEL_START_DELAY: 3000,
    
    // 颜色设置
    COLORS: {
        BACKGROUND: '#000011',
        GROUND: '#654321',
        CITY: '#00ff00',
        CITY_LIGHTS: '#ffff00',
        LAUNCH_PAD: '#ffffff',
        LAUNCH_PAD_TOP: '#ff0000',
        PLAYER_MISSILE: '#ffffff',
        PLAYER_TRAIL: '#00ffff',
        ENEMY_MISSILE: '#ff0000',
        ENEMY_TRAIL: '#ff0000',
        PLAYER_EXPLOSION: '#ffff00',
        ENEMY_EXPLOSION: '#ff0000',
        EXPLOSION_CORE: '#ffffff',
        STAR: '#ffffff',
        UI_TEXT: '#ffff00',
        INFO_TEXT: '#cccccc',
        PAUSE_OVERLAY: 'rgba(0, 0, 0, 0.7)'
    },
    
    // 字体设置
    FONTS: {
        LARGE: '48px Courier New',
        MEDIUM: '32px Courier New',
        NORMAL: '24px Courier New',
        SMALL: '16px Courier New'
    },
    
    // 城市主题配置
    CITY_THEMES: {
        1: { // 北京 - 古都新貌
            name: '北京',
            nameEn: 'Beijing',
            background: '#1a1a2e',
            skyGradient: ['#16213e', '#0f3460'],
            groundColor: '#8b4513',
            cityColor: '#b8860b',
            cityLights: '#ffd700',
            starColor: '#ffeaa7',
            atmosphere: 'majestic'
        },
        2: { // 上海 - 东方明珠
            name: '上海',
            nameEn: 'Shanghai',
            background: '#0f0f23',
            skyGradient: ['#2d3436', '#636e72'],
            groundColor: '#2d3436',
            cityColor: '#00cec9',
            cityLights: '#fd79a8',
            starColor: '#81ecec',
            atmosphere: 'modern'
        },
        3: { // 深圳 - 科技新城
            name: '深圳',
            nameEn: 'Shenzhen',
            background: '#0c0c1e',
            skyGradient: ['#2d3748', '#4a5568'],
            groundColor: '#2d3748',
            cityColor: '#4299e1',
            cityLights: '#63b3ed',
            starColor: '#bee3f8',
            atmosphere: 'futuristic'
        },
        4: { // 纽约 - 不夜之城
            name: '纽约',
            nameEn: 'New York',
            background: '#1a1a2e',
            skyGradient: ['#16537e', '#2d3748'],
            groundColor: '#4a5568',
            cityColor: '#a0aec0',
            cityLights: '#fbb6ce',
            starColor: '#e2e8f0',
            atmosphere: 'urban'
        },
        5: { // 东京 - 科技之都
            name: '东京',
            nameEn: 'Tokyo',
            background: '#1a1a2e',
            skyGradient: ['#553c9a', '#ee5a24'],
            groundColor: '#2d3748',
            cityColor: '#fd79a8',
            cityLights: '#fdcb6e',
            starColor: '#fab1a0',
            atmosphere: 'neon'
        },
        6: { // 伦敦 - 雾都风情
            name: '伦敦',
            nameEn: 'London',
            background: '#2d3436',
            skyGradient: ['#636e72', '#b2bec3'],
            groundColor: '#636e72',
            cityColor: '#74b9ff',
            cityLights: '#fd79a8',
            starColor: '#ddd',
            atmosphere: 'foggy'
        },
        7: { // 巴黎 - 浪漫之都
            name: '巴黎',
            nameEn: 'Paris',
            background: '#2d3436',
            skyGradient: ['#a29bfe', '#fd79a8'],
            groundColor: '#636e72',
            cityColor: '#fdcb6e',
            cityLights: '#fd79a8',
            starColor: '#f8c291',
            atmosphere: 'romantic'
        },
        8: { // 悉尼 - 海港明珠
            name: '悉尼',
            nameEn: 'Sydney',
            background: '#0984e3',
            skyGradient: ['#74b9ff', '#0984e3'],
            groundColor: '#fdcb6e',
            cityColor: '#00b894',
            cityLights: '#fd79a8',
            starColor: '#ffeaa7',
            atmosphere: 'oceanic'
        },
        9: { // 京都 - 古都风韵
            name: '京都',
            nameEn: 'Kyoto',
            background: '#2d3436',
            skyGradient: ['#636e72', '#2d3436'],
            groundColor: '#8b4513',
            cityColor: '#e17055',
            cityLights: '#fdcb6e',
            starColor: '#ffeaa7',
            atmosphere: 'traditional'
        },
        10: { // 新德里 - 印度门
            name: '新德里',
            nameEn: 'New Delhi',
            background: '#e17055',
            skyGradient: ['#fd79a8', '#e84393'],
            groundColor: '#d63031',
            cityColor: '#fdcb6e',
            cityLights: '#fd79a8',
            starColor: '#ffeaa7',
            atmosphere: 'exotic'
        },
        11: { // 莫斯科 - 红场风情
            name: '莫斯科',
            nameEn: 'Moscow',
            background: '#2d3436',
            skyGradient: ['#636e72', '#2d3436'],
            groundColor: '#ffffff',
            cityColor: '#d63031',
            cityLights: '#ffd700',
            starColor: '#ffffff',
            atmosphere: 'imperial'
        },
        12: { // 马德里 - 西班牙风情
            name: '马德里',
            nameEn: 'Madrid',
            background: '#e17055',
            skyGradient: ['#fd79a8', '#fdcb6e'],
            groundColor: '#e17055',
            cityColor: '#fdcb6e',
            cityLights: '#fd79a8',
            starColor: '#ffeaa7',
            atmosphere: 'passionate'
        },
        13: { // 里斯本 - 航海之都
            name: '里斯本',
            nameEn: 'Lisbon',
            background: '#0984e3',
            skyGradient: ['#74b9ff', '#0984e3'],
            groundColor: '#fdcb6e',
            cityColor: '#74b9ff',
            cityLights: '#fd79a8',
            starColor: '#ffffff',
            atmosphere: 'maritime'
        },
        14: { // 柏林 - 现代之都
            name: '柏林',
            nameEn: 'Berlin',
            background: '#2d3436',
            skyGradient: ['#636e72', '#b2bec3'],
            groundColor: '#636e72',
            cityColor: '#a29bfe',
            cityLights: '#fd79a8',
            starColor: '#ddd',
            atmosphere: 'modern'
        },
        15: { // 开普敦 - 非洲之星
            name: '开普敦',
            nameEn: 'Cape Town',
            background: '#e17055',
            skyGradient: ['#fd79a8', '#fdcb6e'],
            groundColor: '#8b4513',
            cityColor: '#00b894',
            cityLights: '#fdcb6e',
            starColor: '#ffeaa7',
            atmosphere: 'african'
        },
        16: { // 惠灵顿 - 新西兰之心
            name: '惠灵顿',
            nameEn: 'Wellington',
            background: '#00b894',
            skyGradient: ['#55a3ff', '#00b894'],
            groundColor: '#00cec9',
            cityColor: '#74b9ff',
            cityLights: '#fdcb6e',
            starColor: '#ffffff',
            atmosphere: 'natural'
        },
        17: { // 新加坡 - 狮城明珠
            name: '新加坡',
            nameEn: 'Singapore',
            background: '#0984e3',
            skyGradient: ['#74b9ff', '#00cec9'],
            groundColor: '#2d3748',
            cityColor: '#00cec9',
            cityLights: '#fd79a8',
            starColor: '#81ecec',
            atmosphere: 'tropical'
        }
    }
}; 