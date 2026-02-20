let audioContext = null;
let correctSoundBuffer = null;
let soundEnabled = true;

export function setSoundEnabled(enabled) {
  soundEnabled = !!enabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function playSynthDing() {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = 880;
  oscillator.type = 'sine';
  gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.2);
}

/** C major arpeggio up an octave: C5, E5, G5, C6, E6 (ascending, harmonious) */
const WIN_ARPEGGIO_FREQS = [523.25, 659.25, 783.99, 1046.5, 1318.51];
const NOTE_DURATION = 0.12;
const NOTE_GAP = 0.02;

export function playWinArpeggio() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    WIN_ARPEGGIO_FREQS.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const start = now + i * (NOTE_DURATION + NOTE_GAP);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.2, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, start + NOTE_DURATION);
      osc.start(start);
      osc.stop(start + NOTE_DURATION);
    });
  } catch (e) {
    // Ignore if audio fails
  }
}

function playFromBuffer() {
  const ctx = getAudioContext();
  const source = ctx.createBufferSource();
  source.buffer = correctSoundBuffer;
  source.connect(ctx.destination);
  source.start(0);
}

/**
 * Play a satisfying "correct" ding when a green letter is revealed.
 * Tries to load public/sounds/correct.mp3 or correct.wav first;
 * falls back to synthesized ding if no file exists.
 */
export function playCorrectSound() {
  if (!soundEnabled) return;
  try {
    if (correctSoundBuffer) {
      playFromBuffer();
      return;
    }
    playSynthDing();
  } catch (e) {
    // Ignore if audio fails (e.g. user hasn't interacted with page)
  }
}

// Preload custom sound if it exists (Vite serves public/ at root)
export function preloadCorrectSound() {
  fetch('./sounds/correct.mp3')
    .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
    .then((buf) => getAudioContext().decodeAudioData(buf))
    .then((buffer) => {
      correctSoundBuffer = buffer;
    })
    .catch(() => {
      fetch('./sounds/correct.wav')
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
        .then((buf) => getAudioContext().decodeAudioData(buf))
        .then((buffer) => {
          correctSoundBuffer = buffer;
        })
        .catch(() => {});
    });
}
