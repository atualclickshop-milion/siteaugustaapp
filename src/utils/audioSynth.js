// Soft ambient audio generator using Web Audio API for calm night atmosphere
class SoothingSynth {
  constructor() {
    this.ctx = null;
    this.gainNode = null;
    this.oscNodes = [];
    this.isPlaying = false;
    this.timer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playGentleTone(freq = 432, duration = 4) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Synth tone note:", e);
    }
  }

  // Plays a soothing celestial lullaby chime sequence (F# Major peaceful chords)
  playChimeChord() {
    const notes = [277.18, 369.99, 440.00, 554.37]; // C#4, F#4, A4, C#5
    notes.forEach((note, index) => {
      setTimeout(() => {
        this.playGentleTone(note, 3.5);
      }, index * 400);
    });
  }
}

export const soothingSynth = new SoothingSynth();
