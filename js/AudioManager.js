/**
 * 音效管理器 - 基于Web Audio API生成经典游戏音效
 * 参考 RetroWaveFX 项目的设计理念
 */
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.initialized = false;
        this.soundEffects = new Map();
        this.enabled = true;
        
        // 初始化音效库
        this.initSoundEffects();
        
        // 尝试在用户交互时初始化音频上下文
        this.setupUserInteractionHandlers();
    }

    /**
     * 设置用户交互处理器以初始化音频上下文
     */
    setupUserInteractionHandlers() {
        const initAudio = () => {
            this.initAudioContext();
            document.removeEventListener('click', initAudio);
            document.removeEventListener('keydown', initAudio);
            document.removeEventListener('touchstart', initAudio);
        };

        document.addEventListener('click', initAudio);
        document.addEventListener('keydown', initAudio);
        document.addEventListener('touchstart', initAudio);
    }

    /**
     * 初始化音频上下文
     */
    async initAudioContext() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0.3; // 主音量

            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            this.initialized = true;
            console.log('音效系统初始化成功');
        } catch (error) {
            console.error('音效系统初始化失败:', error);
        }
    }

    /**
     * 初始化音效库
     */
    initSoundEffects() {
        // 发射导弹音效
        this.registerSound('missileLaunch', {
            description: '发射导弹音效',
            emoji: '🚀'
        }, (audioCtx) => {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.1);
        });

        // 爆炸音效
        this.registerSound('explosion', {
            description: '爆炸音效',
            emoji: '💥'
        }, (audioCtx) => {
            const bufferSize = audioCtx.sampleRate * 0.3;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            
            // 生成白噪声
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const source = audioCtx.createBufferSource();
            const gainNode = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();
            
            source.buffer = buffer;
            source.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.8, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            
            source.start(audioCtx.currentTime);
            source.stop(audioCtx.currentTime + 0.3);
        });

        // 城市被摧毁音效
        this.registerSound('cityDestroyed', {
            description: '城市被摧毁音效',
            emoji: '🏚️'
        }, (audioCtx) => {
            const oscillator1 = audioCtx.createOscillator();
            const oscillator2 = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator1.type = 'square';
            oscillator2.type = 'sawtooth';
            
            oscillator1.frequency.setValueAtTime(150, audioCtx.currentTime);
            oscillator1.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.5);
            
            oscillator2.frequency.setValueAtTime(300, audioCtx.currentTime);
            oscillator2.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0.6, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            
            oscillator1.start(audioCtx.currentTime);
            oscillator2.start(audioCtx.currentTime);
            oscillator1.stop(audioCtx.currentTime + 0.5);
            oscillator2.stop(audioCtx.currentTime + 0.5);
        });

        // 游戏结束音效
        this.registerSound('gameOver', {
            description: '游戏结束音效',
            emoji: '💀'
        }, (audioCtx) => {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.type = 'triangle';
            
            const frequencies = [440, 415, 392, 349, 330];
            let time = audioCtx.currentTime;
            
            frequencies.forEach((freq, index) => {
                oscillator.frequency.setValueAtTime(freq, time);
                time += 0.3;
            });
            
            gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime + 1.2);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
            
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 1.5);
        });

        // 关卡完成音效
        this.registerSound('levelComplete', {
            description: '关卡完成音效',
            emoji: '🎉'
        }, (audioCtx) => {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.type = 'sine';
            
            const frequencies = [523, 659, 784, 1047];
            let time = audioCtx.currentTime;
            
            frequencies.forEach((freq, index) => {
                oscillator.frequency.setValueAtTime(freq, time);
                time += 0.2;
            });
            
            gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime + 0.6);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
            
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.8);
        });
    }

    /**
     * 注册音效
     */
    registerSound(name, metadata, generator) {
        this.soundEffects.set(name, {
            metadata,
            generator
        });
    }

    /**
     * 播放音效
     */
    playSound(soundName) {
        if (!this.enabled || !this.initialized || !this.audioContext) {
            return;
        }

        const sound = this.soundEffects.get(soundName);
        if (!sound) {
            console.warn(`音效 "${soundName}" 未找到`);
            return;
        }

        try {
            sound.generator(this.audioContext);
        } catch (error) {
            console.error(`播放音效 "${soundName}" 时出错:`, error);
        }
    }

    /**
     * 设置音效开关
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    /**
     * 设置主音量
     */
    setVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }

    /**
     * 获取所有音效名称
     */
    getAllSoundNames() {
        return Array.from(this.soundEffects.keys());
    }
}

// 创建全局音效管理器实例
window.AudioManager = new AudioManager(); 