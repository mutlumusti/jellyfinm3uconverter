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

// Static files - serve frontend
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api', apiRouter);

// Socket.IO handlers
setupSocketHandlers(io);

// Make io accessible to routes
app.set('io', io);

// Yapılandırma dosyası yolu
const CONFIG_PATH = path.join(__dirname, '../config.json');

// Yapılandırmayı yükle
async function loadConfig() {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return {
      m3uUrl: '',
      outputPaths: {
        liveTV: './output/livetv',
        movies: './output/movies',
        series: './output/series'
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

server.listen(PORT, async () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    IPTV İŞLEYİCİ                             ║
║                                                              ║
║   Sunucu adresi: http://localhost:${PORT}                      ║
║   Playlistlerinizi işlemeye hazır!                           ║
╚══════════════════════════════════════════════════════════════╝
  `);

  // Zamanlayıcıyı başlat
  await initializeScheduler();
});

export { io };
