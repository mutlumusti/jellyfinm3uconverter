/**
 * Electron Ana İşlem
 * Masaüstü uygulaması için ana süreç
 */

import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

import { startServer } from '../src/server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let serverInstance;

// Ana pencereyi oluştur
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        title: 'IPTV İşleyici',
        icon: path.join(__dirname, '../public/icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        backgroundColor: '#0a0a0f',
        show: false
    });

    // Sunucunun başlamasını bekle
    setTimeout(() => {
        mainWindow.loadURL('http://localhost:3000');
    }, 2000);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Menü çubuğunu gizle
    mainWindow.setMenuBarVisibility(false);
}

// Klasör seçme dialog'u
ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
        title: 'Klasör Seçin'
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});

// Uygulama hazır olduğunda
app.whenReady().then(() => {
    serverInstance = startServer();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Tüm pencereler kapatıldığında
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
