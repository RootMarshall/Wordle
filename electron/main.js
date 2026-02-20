const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const wordlesPath = path.join(__dirname, '../node_modules/wordles/wordles.json');
const wordles = JSON.parse(fs.readFileSync(wordlesPath, 'utf8'));

const WORDLE_EPOCH = new Date('2021-06-19');

function getDaysSinceEpoch(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const epoch = new Date(WORDLE_EPOCH);
  epoch.setHours(0, 0, 0, 0);
  return Math.floor((d - epoch) / (24 * 60 * 60 * 1000));
}

function getSolutionByDate(date) {
  const index = getDaysSinceEpoch(date);
  if (index >= 0 && index < wordles.length) {
    return wordles[index].toLowerCase();
  }
  return wordles[0].toLowerCase();
}

function getLocalDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function fetchTodaysWord() {
  const dateStr = getLocalDateString();
  const url = `https://www.nytimes.com/svc/wordle/v2/${dateStr}.json`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Wordle-Desktop/1.0' },
    });
    if (res.ok) {
      const data = await res.json();
      return (data.solution || '').toLowerCase();
    }
  } catch (err) {
    console.warn('NYT API fetch failed, using fallback:', err.message);
  }
  return getSolutionByDate(new Date());
}

ipcMain.handle('get-todays-word', async () => {
  return fetchTodaysWord();
});

ipcMain.handle('set-system-volume', async (_event, level) => {
  if (process.platform === 'win32') {
    const presses = Math.round(Math.min(50, Math.max(0, level / 2)));
    const script = `$w=New-Object -Com WScript.Shell;for($i=0;$i -lt 50;$i++){$w.SendKeys([char]174)};for($i=0;$i -lt ${presses};$i++){$w.SendKeys([char]175)}`;
    exec(`powershell -NoProfile -Command "${script}"`, () => {});
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 560,
    height: 720,
    minWidth: 480,
    minHeight: 600,
    title: 'Wordle',
    backgroundColor: '#121213',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
  });

  const isDev = !app.isPackaged;
  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  win.once('ready-to-show', () => win.show());
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
