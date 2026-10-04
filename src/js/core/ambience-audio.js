const sources = {
  main: { file: 'mountain-morning', gain: 0.06 },
  water: { file: 'water-flow', gain: 0.18 },
  climate: { file: 'light-rain', gain: 0.16 },
  mountains: { file: 'mountain-wind', gain: 0.16 },
};

export class AmbienceAudio {
  constructor({ muted = false, volume = 0.3 } = {}) {
    this.muted = muted;
    this.volume = this.clamp(volume);
    this.scene = 'main';
    this.started = false;
    this.players = new Map();
    this.fadeFrames = new Map();
  }

  clamp(value) {
    return Math.max(0, Math.min(1, Number(value) || 0));
  }

  activate() {
    if (this.started) return;
    this.started = true;
    if (!this.muted) this.playScene(this.scene);
  }

  setScene(scene) {
    if (!sources[scene] || this.scene === scene) return;
    this.scene = scene;
    if (this.started && !this.muted) this.playScene(scene);
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (this.muted) {
      for (const [scene, player] of this.players) this.fade(scene, player, 0, true, 180);
    } else if (this.started) {
      this.playScene(this.scene);
    }
  }

  setVolume(volume) {
    this.volume = this.clamp(volume);
    const player = this.players.get(this.scene);
    if (player && !this.muted && !player.paused) {
      this.fade(this.scene, player, sources[this.scene].gain * this.volume, false, 100);
    }
  }

  playerFor(scene) {
    if (this.players.has(scene)) return this.players.get(scene);
    const audio = document.createElement('audio');
    const source = sources[scene];
    const ogg = new URL(`../../../assets/audio/ambience/${source.file}.ogg`, import.meta.url);
    const mp3 = new URL(`../../../assets/audio/ambience/${source.file}.mp3`, import.meta.url);
    const supportsOgg = audio.canPlayType('audio/ogg; codecs="vorbis"');
    audio.src = supportsOgg ? ogg.href : mp3.href;
    audio.loop = true;
    audio.preload = 'none';
    audio.volume = 0;
    audio.addEventListener('error', () => {
      if (audio.src !== mp3.href) {
        audio.src = mp3.href;
        audio.load();
        if (this.started && !this.muted && this.scene === scene) {
          audio.play().then(() => this.fade(scene, audio, source.gain * this.volume, false, 250)).catch(() => {});
        }
        return;
      }
      console.debug(`Ambience asset unavailable for scene: ${scene}`);
    });
    this.players.set(scene, audio);
    return audio;
  }

  playScene(scene) {
    const next = this.playerFor(scene);
    for (const [previousScene, player] of this.players) {
      if (previousScene !== scene && !player.paused) this.fade(previousScene, player, 0, true, 320);
    }
    next.play().then(() => {
      if (this.scene === scene && !this.muted) {
        this.fade(scene, next, sources[scene].gain * this.volume, false, 420);
      }
    }).catch(() => {
      if (this.scene === scene && !this.muted) console.debug(`Ambience playback unavailable for scene: ${scene}`);
    });
  }

  fade(scene, player, target, stop, duration) {
    const previousFrame = this.fadeFrames.get(scene);
    if (previousFrame) cancelAnimationFrame(previousFrame);
    const initial = player.volume;
    const start = performance.now();
    const step = now => {
      const progress = Math.min(1, (now - start) / duration);
      player.volume = this.clamp(initial + (target - initial) * progress);
      if (progress < 1) {
        this.fadeFrames.set(scene, requestAnimationFrame(step));
      } else {
        this.fadeFrames.delete(scene);
        if (stop) player.pause();
      }
    };
    this.fadeFrames.set(scene, requestAnimationFrame(step));
  }
}