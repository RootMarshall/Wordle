const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('wordleAPI', {
  getTodaysWord: () => ipcRenderer.invoke('get-todays-word'),
  setSystemVolume: (level) => ipcRenderer.invoke('set-system-volume', level),
});
