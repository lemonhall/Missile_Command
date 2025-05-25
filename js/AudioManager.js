/**
 * 音效管理器 - 基于Web Audio API生成经典游戏音效
 * 参考 RetroWaveFX 项目的设计理念
 */
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.bgmGain = null;
        this.initialized = false;
        this.soundEffects = new Map();
        this.enabled = true;
        this.bgmEnabled = true;
        
        // 背景音乐相关
        this.currentBGM = null;
        this.bgmVolume = 0.15; // 较低的背景音乐音量
        
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
            this.bgmGain = this.audioContext.createGain();
            
            this.masterGain.connect(this.audioContext.destination);
            this.bgmGain.connect(this.audioContext.destination);
            
            this.masterGain.gain.value = 0.3; // 音效音量
            this.bgmGain.gain.value = this.bgmVolume; // BGM音量

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
            // 简单但有效的爆炸声 - 低频突然爆发然后快速衰减
            
            // 主要爆炸声 - 使用低频振荡器
            const mainOsc = audioCtx.createOscillator();
            const mainGain = audioCtx.createGain();
            const mainFilter = audioCtx.createBiquadFilter();
            
            mainOsc.connect(mainFilter);
            mainFilter.connect(mainGain);
            mainGain.connect(this.masterGain);
            
            // 设置为低频方波，模拟爆炸的"boom"
            mainOsc.type = 'square';
            mainOsc.frequency.setValueAtTime(60, audioCtx.currentTime);
            mainOsc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.2);
            
            // 低通滤波器让声音更沉闷
            mainFilter.type = 'lowpass';
            mainFilter.frequency.setValueAtTime(200, audioCtx.currentTime);
            mainFilter.Q.value = 1;
            
            // 爆炸的音量包络 - 突然开始，快速衰减
            mainGain.gain.setValueAtTime(0, audioCtx.currentTime);
            mainGain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.01); // 10ms内达到最大音量
            mainGain.gain.exponentialRampToValueAtTime(0.1, audioCtx.currentTime + 0.1);
            mainGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            
            // 添加一些噪声来增加质感
            const noiseBufferSize = audioCtx.sampleRate * 0.2;
            const noiseBuffer = audioCtx.createBuffer(1, noiseBufferSize, audioCtx.sampleRate);
            const noiseData = noiseBuffer.getChannelData(0);
            
            for (let i = 0; i < noiseBufferSize; i++) {
                // 生成衰减的噪声
                const decay = Math.exp(-i / (noiseBufferSize * 0.1));
                noiseData[i] = (Math.random() * 2 - 1) * decay * 0.3;
            }
            
            const noiseSource = audioCtx.createBufferSource();
            const noiseGain = audioCtx.createGain();
            const noiseFilter = audioCtx.createBiquadFilter();
            
            noiseSource.buffer = noiseBuffer;
            noiseSource.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(this.masterGain);
            
            // 噪声滤波 - 只保留低频部分
            noiseFilter.type = 'lowpass';
            noiseFilter.frequency.value = 500;
            
            noiseGain.gain.setValueAtTime(0.4, audioCtx.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            
            // 启动音效
            mainOsc.start(audioCtx.currentTime);
            mainOsc.stop(audioCtx.currentTime + 0.3);
            
            noiseSource.start(audioCtx.currentTime);
            noiseSource.stop(audioCtx.currentTime + 0.2);
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

        // 链式爆炸音效（更短促的爆炸声）
        this.registerSound('chainExplosion', {
            description: '链式爆炸音效',
            emoji: '⚡'
        }, (audioCtx) => {
            // 简单的"pop"声效果
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            
            // 中频方波，快速衰减
            osc.type = 'square';
            osc.frequency.setValueAtTime(120, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.08);
            
            // 低通滤波
            filter.type = 'lowpass';
            filter.frequency.value = 300;
            
            // 快速的爆发和衰减
            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
            
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.08);
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

    /**
     * 播放背景音乐
     */
    async playBGM(musicPath) {
        console.log('尝试播放BGM:', musicPath, '初始化状态:', this.initialized, 'BGM启用:', this.bgmEnabled);
        
        if (!this.bgmEnabled) {
            console.log('BGM被禁用，跳过播放');
            return;
        }
        
        if (!this.initialized) {
            console.log('音频上下文未初始化，尝试初始化...');
            await this.initAudioContext();
            if (!this.initialized) {
                console.error('音频上下文初始化失败');
                return;
            }
        }

        try {
            // 停止当前BGM
            this.stopBGM();
            console.log('开始加载音频文件...');

            // 创建音频元素
            const audio = new Audio(musicPath);
            audio.loop = true;
            audio.volume = 1; // 使用正常音量，通过Web Audio API控制

            // 等待音频加载
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('音频加载超时'));
                }, 10000); // 10秒超时

                audio.addEventListener('canplaythrough', () => {
                    clearTimeout(timeout);
                    console.log('音频文件加载完成');
                    resolve();
                });
                
                audio.addEventListener('error', (e) => {
                    clearTimeout(timeout);
                    console.error('音频加载错误:', e);
                    reject(e);
                });
                
                audio.load();
            });

            // 创建Web Audio API节点
            const source = this.audioContext.createMediaElementSource(audio);
            source.connect(this.bgmGain);

            this.currentBGM = {
                audio: audio,
                source: source
            };

            // 开始播放
            console.log('开始播放音频...');
            await audio.play();
            console.log('背景音乐开始播放成功:', musicPath);

        } catch (error) {
            console.error('播放背景音乐失败:', error);
            console.error('错误详情:', error.message);
        }
    }

    /**
     * 停止背景音乐
     */
    stopBGM() {
        if (this.currentBGM) {
            this.currentBGM.audio.pause();
            this.currentBGM.audio.currentTime = 0;
            this.currentBGM = null;
        }
    }

    /**
     * 暂停背景音乐
     */
    pauseBGM() {
        if (this.currentBGM) {
            this.currentBGM.audio.pause();
        }
    }

    /**
     * 恢复背景音乐
     */
    resumeBGM() {
        if (this.currentBGM && this.bgmEnabled) {
            this.currentBGM.audio.play().catch(console.error);
        }
    }

    /**
     * 设置背景音乐开关
     */
    setBGMEnabled(enabled) {
        this.bgmEnabled = enabled;
        if (!enabled) {
            this.pauseBGM();
        } else {
            this.resumeBGM();
        }
    }

    /**
     * 设置背景音乐音量
     */
    setBGMVolume(volume) {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.bgmGain) {
            this.bgmGain.gain.value = this.bgmVolume;
        }
    }
}

// 创建全局音效管理器实例
window.AudioManager = new AudioManager(); 