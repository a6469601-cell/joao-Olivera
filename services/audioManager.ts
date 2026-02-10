
class AudioManager {
  private static instance: AudioManager;
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientSource: AudioBufferSourceNode | null = null;

  private constructor() {}

  public static getInstance() {
    if (!this.instance) this.instance = new AudioManager();
    return this.instance;
  }

  private init() {
    if (this.context) return;
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
    this.masterGain.gain.value = 0.5;
  }

  public playSound(type: 'click' | 'growl' | 'heartbeat' | 'crunch' | 'howl') {
    this.init();
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const g = this.context.createGain();
    osc.connect(g);
    g.connect(this.masterGain);

    const now = this.context.currentTime;

    switch (type) {
      case 'click':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(10, now + 0.15);
        g.gain.setValueAtTime(0.3, now);
        g.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      case 'growl':
        const bufferSize = this.context.sampleRate * 0.8;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = this.context.createBufferSource();
        noise.buffer = buffer;
        const filter = this.context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now);
        filter.frequency.exponentialRampToValueAtTime(80, now + 0.8);
        noise.connect(filter);
        filter.connect(this.masterGain);
        noise.start(now);
        noise.stop(now + 0.8);
        break;
      case 'howl':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 1.5);
        osc.frequency.exponentialRampToValueAtTime(300, now + 3);
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.2, now + 0.5);
        g.gain.linearRampToValueAtTime(0, now + 3);
        osc.start(now);
        osc.stop(now + 3);
        break;
      case 'heartbeat':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(50, now);
        g.gain.setValueAtTime(0.7, now);
        g.gain.linearRampToValueAtTime(0, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
      case 'crunch':
        osc.type = 'square';
        osc.frequency.setValueAtTime(60, now);
        g.gain.setValueAtTime(0.25, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
    }
  }

  public startAmbience() {
    this.init();
    if (!this.context || !this.masterGain) return;
    
    // Vento Profundo
    const bufferSize = this.context.sampleRate * 4;
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    
    const noise = this.context.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const filter = this.context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 150;
    
    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start();
    this.ambientSource = noise;
  }
}

export const audio = AudioManager.getInstance();
