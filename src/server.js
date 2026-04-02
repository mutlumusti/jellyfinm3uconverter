/**
 * IPTV İşleyici - Ana Sunucu
 * Express + Socket.IO ile gerçek zamanlı işleme güncellemeleri
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { router as apiRouter } from './routes/api.js';
import { setupSocketHandlers } from './services/socket-handler.js';
import { initScheduler, updateSchedule } from './services/scheduler.js';
import { processPlaylist } from './services/processor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik dosyalar
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Dizin yollarını belirle (Paketlenmiş uygulama için AppData kullan)
let baseDataPath = process.env.DATA_DIR || path.join(__dirname, '..');
if (!process.env.DATA_DIR) {
  try {
    const { app: electronApp } = await import('electron');
    if (electronApp && electronApp.isPackaged) {
      baseDataPath = electronApp.getPath('userData');
    }
  } catch (e) {
    // Electron ortamında değiliz
  }
}

const CONFIG_PATH = path.join(baseDataPath, 'config.json');
const OUTPUT_BASE = path.join(baseDataPath, 'output');

// Gerekli klasörleri oluştur
async function ensureDirs() {
  await fs.mkdir(OUTPUT_BASE, { recursive: true });
  await fs.mkdir(path.join(OUTPUT_BASE, 'livetv'), { recursive: true });
  await fs.mkdir(path.join(OUTPUT_BASE, 'movies'), { recursive: true });
  await fs.mkdir(path.join(OUTPUT_BASE, 'series'), { recursive: true });
}

// API routes
app.use('/api', apiRouter);
app.set('io', io);

// Socket.IO handlers
setupSocketHandlers(io);

// Config yükle
async function loadConfig() {
  try {
    await ensureDirs();
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    const config = JSON.parse(data);
    // Pathleri güncelle
    config.outputPaths = {
      liveTV: path.join(OUTPUT_BASE, 'livetv'),
      movies: path.join(OUTPUT_BASE, 'movies'),
      series: path.join(OUTPUT_BASE, 'series')
    };
    return config;
  } catch {
    return {
      m3uUrl: '',
      outputPaths: {
        liveTV: path.join(OUTPUT_BASE, 'livetv'),
        movies: path.join(OUTPUT_BASE, 'movies'),
        series: path.join(OUTPUT_BASE, 'series')
      },
      schedule: { enabled: false }
    };
  }
}

// Zamanlayıcıyı başlat
initScheduler(processPlaylist, loadConfig, io);

// Sunucu başladığında mevcut zamanlamayı yükle
async function initializeScheduler() {
  try {
    const config = await loadConfig();
    if (config.schedule && config.schedule.enabled) {
      console.log('📅 Kayıtlı zamanlama yükleniyor...');
      updateSchedule(config.schedule);
    }
  } catch (error) {
    console.error('Zamanlama yüklenemedi:', error.message);
  }
}

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;

export function startServer(io_callback) {
  server.listen(PORT, async () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
    await initializeScheduler();
    if (io_callback) io_callback(io);
  });
  return server;
}

export { io };

// Eğer dosya doğrudan çalıştırılmışsa sunucuyu başlat (örn. Docker veya npm run server)
import url from 'url';
if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  startServer();
}
