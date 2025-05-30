// 城市渲染器工厂
class CityRendererFactory {
    constructor() {
        this.renderers = new Map();
        this.initializeRenderers();
    }
    
    initializeRenderers() {
        // 注册所有城市渲染器
        this.renderers.set(1, new BeijingRenderer());
        this.renderers.set(2, new ShanghaiRenderer());
        this.renderers.set(3, new ShenzhenRenderer());
        this.renderers.set(4, new NewYorkRenderer());
        this.renderers.set(5, new TokyoRenderer());
        this.renderers.set(6, new LondonRenderer());
        this.renderers.set(7, new ParisRenderer());
        this.renderers.set(8, new SydneyRenderer());
        this.renderers.set(9, new KyotoRenderer());
        this.renderers.set(10, new NewDelhiRenderer());
        this.renderers.set(11, new MoscowRenderer());
        this.renderers.set(12, new MadridRenderer());
        this.renderers.set(13, new LisbonRenderer());
        this.renderers.set(14, new BerlinRenderer());
        this.renderers.set(15, new CapeTownRenderer());
        this.renderers.set(16, new WellingtonRenderer());
        this.renderers.set(17, new SingaporeRenderer());
    }
    
    getRenderer(level) {
        // 根据关卡获取对应的城市渲染器
        const themeIndex = ((level - 1) % 17) + 1;
        return this.renderers.get(themeIndex) || this.getDefaultRenderer();
    }
    
    getDefaultRenderer() {
        // 默认渲染器（使用基础城市渲染器）
        return new DefaultCityRenderer();
    }
}

// 默认城市渲染器
class DefaultCityRenderer extends BaseCityRenderer {
    constructor() {
        super();
        this.name = '未知城市';
        this.nameEn = 'Unknown City';
    }
    
    render(city, index, cityTheme, time, ctx) {
        // 绘制基础建筑
        this.drawBuildingBase(city, cityTheme, ctx);
        
        // 绘制基础窗户
        this.drawBasicWindows(city, cityTheme, time, index, ctx);
    }
} 