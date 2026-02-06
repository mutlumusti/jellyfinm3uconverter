/**
 * Electron Preload Script
 * Güvenli köprü - renderer ve main process arasında iletişim
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectFolder: () => ipcRenderer.invoke('select-folder')
});
