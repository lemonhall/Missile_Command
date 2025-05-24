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
    ENEMY_MISSILE_BASE_SPEED: 30,
    ENEMY_MISSILE_SPEED_INCREMENT: 8,
    ENEMY_MISSILE_TRAIL_LENGTH: 8,
    ENEMY_MISSILE_BASE_COUNT: 8,
    ENEMY_MISSILE_COUNT_INCREMENT: 2,
    
    // 生成时间设置
    ENEMY_SPAWN_BASE_RATE: 1500,
    ENEMY_SPAWN_RATE_DECREMENT: 150,
    ENEMY_SPAWN_MIN_RATE: 300,
    ENEMY_SPAWN_RANDOM_DELAY: 1000,
    
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
    }
}; 