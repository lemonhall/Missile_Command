// 游戏初始化
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new MissileCommand();
    
    // 设置静音按钮功能
    const muteBtn = document.getElementById('muteBtn');
    let isMuted = false;
    
    muteBtn.addEventListener('click', () => {
        if (window.AudioManager) {
            isMuted = !isMuted;
            window.AudioManager.setEnabled(!isMuted);
            muteBtn.textContent = isMuted ? '🔇' : '🔊';
            console.log(isMuted ? '音效已关闭' : '音效已开启');
        }
    });
    
    // 设置BGM按钮功能
    const bgmBtn = document.getElementById('bgmBtn');
    let bgmMuted = false;
    
    bgmBtn.addEventListener('click', () => {
        if (window.AudioManager) {
            bgmMuted = !bgmMuted;
            window.AudioManager.setBGMEnabled(!bgmMuted);
            bgmBtn.textContent = bgmMuted ? '🎵' : '🎶';
            console.log(bgmMuted ? '背景音乐已关闭' : '背景音乐已开启');
        }
    });
    
    console.log('导弹指挥官游戏已加载完成！');
    console.log('点击"开始游戏"按钮开始保卫城市！');
    console.log('音效系统已加载，首次点击游戏画面会自动激活音效');
}); 