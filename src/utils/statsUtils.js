const STATS_KEY = 'wordle-stats';
const SETTINGS_KEY = 'wordle-settings';

function getLocalDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { gamesPlayed: 0, gamesWon: 0, currentStreak: 0, maxStreak: 0, lastPlayedDate: null };
    const data = JSON.parse(raw);
    const today = getLocalDateString();
    let { currentStreak } = data;
    if (data.lastPlayedDate) {
      const last = new Date(data.lastPlayedDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate - last) / (24 * 60 * 60 * 1000));
      if (diffDays > 1) currentStreak = 0;
    }
    return {
      gamesPlayed: data.gamesPlayed ?? 0,
      gamesWon: data.gamesWon ?? 0,
      currentStreak: currentStreak ?? 0,
      maxStreak: data.maxStreak ?? 0,
      lastPlayedDate: data.lastPlayedDate,
    };
  } catch {
    return { gamesPlayed: 0, gamesWon: 0, currentStreak: 0, maxStreak: 0, lastPlayedDate: null };
  }
}

export function saveGameResult(won) {
  const stats = loadStats();
  const today = getLocalDateString();
  if (stats.lastPlayedDate === today) return;
  const gamesPlayed = stats.gamesPlayed + 1;
  const gamesWon = stats.gamesWon + (won ? 1 : 0);
  let currentStreak = stats.currentStreak;
  if (won) {
    const last = stats.lastPlayedDate ? new Date(stats.lastPlayedDate) : null;
    const todayDate = new Date(today);
    if (!last) currentStreak = 1;
    else {
      const diffDays = Math.floor((todayDate - last) / (24 * 60 * 60 * 1000));
      currentStreak = diffDays === 1 ? stats.currentStreak + 1 : 1;
    }
  } else {
    currentStreak = 0;
  }
  const maxStreak = Math.max(stats.maxStreak, currentStreak);
  localStorage.setItem(
    STATS_KEY,
    JSON.stringify({ gamesPlayed, gamesWon, currentStreak, maxStreak, lastPlayedDate: today })
  );
}

const DEFAULT_CORRECT_COLOR = '#538d4e';
const DEFAULT_PRESENT_COLOR = '#b59f3b';

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { soundEnabled: true, correctColor: DEFAULT_CORRECT_COLOR, presentColor: DEFAULT_PRESENT_COLOR };
    const data = JSON.parse(raw);
    return {
      soundEnabled: data.soundEnabled !== false,
      correctColor: data.correctColor || DEFAULT_CORRECT_COLOR,
      presentColor: data.presentColor || DEFAULT_PRESENT_COLOR,
    };
  } catch {
    return { soundEnabled: true, correctColor: DEFAULT_CORRECT_COLOR, presentColor: DEFAULT_PRESENT_COLOR };
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}
