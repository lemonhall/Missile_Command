// 游戏事件处理模块
class GameEvents {
    constructor(game) {
        this.game = game;
    }
    
    bindEvents() {
        // 鼠标点击发射导弹
        this.game.canvas.addEventListener('click', (e) => {
            if (this.game.gameState === 'playing') {
                const rect = this.game.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.game.fireMissile(x, y);
            }
        });
        
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.game.togglePause();
                    break;
                case 'KeyR':
                    this.game.restart();
                    break;
            }
        });
        
        // 按钮事件
        document.getElementById('startBtn').addEventListener('click', () => this.game.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.game.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.game.restart());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.game.restart());
    }
} 