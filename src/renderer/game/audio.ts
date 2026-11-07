export type GameAudio = {
  unlock(): void;
  fire(category: string): void;
  reload(): void;
  impact(): void;
  footstep(intensity: number): void;
  enemyShot(pan?: number): void;
  setMuted(muted: boolean): void;
  dispose(): void;
};

export function createGameAudio(): GameAudio {
  const AudioCtor = window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  let context: AudioContext | null = null;
  let master: GainNode | null = null;
  let noise: AudioBuffer | null = null;
  let muted = localStorage.getItem('breach-muted') === 'true';
  let lastStep = 0;
  let disposed = false;

  const ensure = (): AudioContext | null => {
    if (disposed || !AudioCtor) return null;
    if (!context) {
      context = new AudioCtor();
      master = context.createGain();
      master.gain.value = muted ? 0 : 0.48;
      master.connect(context.destination);
      const buffer = context.createBuffer(1, Math.floor(context.sampleRate * 0.5), context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.7);
      }
      noise = buffer;
    }
    if (context.state === 'suspended') void context.resume();
    return context;
  };

  const tone = (frequency: number, duration: number, wave: OscillatorType = 'triangle', volume = 0.2, slide = 0, delay = 0, pan = 0) => {
    const ctx = ensure();
    if (!ctx || !master) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = ctx.currentTime + delay;
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (slide) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, frequency + slide), start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    if (typeof ctx.createStereoPanner === 'function') { const panner=ctx.createStereoPanner(); panner.pan.value=Math.max(-1,Math.min(1,pan)); gain.connect(panner); panner.connect(master); } else gain.connect(master);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  };

  const burst = (duration: number, volume: number, filter: number, pan = 0) => {
    const ctx = ensure();
    if (!ctx || !master || !noise) return;
    const source = ctx.createBufferSource();
    const lowpass = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const start = ctx.currentTime;
    source.buffer = noise;
    lowpass.type = 'lowpass';
    lowpass.frequency.value = filter;
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(lowpass);
    lowpass.connect(gain);
    if (typeof ctx.createStereoPanner === 'function') { const panner=ctx.createStereoPanner(); panner.pan.value=Math.max(-1,Math.min(1,pan)); gain.connect(panner); panner.connect(master); } else gain.connect(master);
    source.start(start);
    source.stop(start + duration);
  };

  return {
    unlock() { ensure(); },
    fire(category) {
      if (category === 'shotgun') {
        for (let i = 0; i < 3; i++) tone(85 + i * 17, 0.11, 'sawtooth', 0.13, -45);
        burst(0.2, 0.36, 950);
      } else if (category === 'marksman' || category === 'battle') {
        tone(125, 0.12, 'sawtooth', 0.26, -75);
        burst(0.13, 0.32, 1250);
      } else if (category === 'sidearm') {
        tone(155, 0.075, 'square', 0.16, -70);
        burst(0.1, 0.22, 1500);
      } else {
        tone(105, 0.075, 'sawtooth', 0.18, -55);
        burst(0.12, 0.23, 1100);
      }
    },
    reload() {
      tone(640, 0.035, 'square', 0.08, -350);
      tone(390, 0.05, 'square', 0.09, -120, 0.17);
      tone(720, 0.045, 'square', 0.07, -280, 0.51);
    },
    impact() {
      tone(75, 0.09, 'triangle', 0.13, -45);
      burst(0.09, 0.14, 480);
    },
    footstep(intensity) {
      const now = performance.now();
      if (now - lastStep < 115) return;
      lastStep = now;
      burst(0.045, 0.055 * intensity, 260);
      tone(68, 0.035, 'sine', 0.045, -18);
    },
    enemyShot(pan = 0) {
      tone(78, 0.08, 'sawtooth', 0.09, -38, 0, pan);
      burst(0.1, 0.12, 600, pan);
    },
    setMuted(value) {
      muted = value;
      if (master && context) master.gain.setTargetAtTime(muted ? 0 : 0.48, context.currentTime, 0.025);
      try { localStorage.setItem('breach-muted', String(value)); } catch { /* storage may be unavailable */ }
    },
    dispose() {
      disposed = true;
      if (context) void context.close();
      context = null;
      master = null;
      noise = null;
    }
  };
}
