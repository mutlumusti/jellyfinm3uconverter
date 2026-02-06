/**
 * API Routes
 * Handles configuration, processing triggers, and status endpoints
 */

import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { processPlaylist } from '../services/processor.js';
import { getScheduler, updateSchedule } from '../services/scheduler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const router = express.Router();

const CONFIG_PATH = path.join(__dirname, '../../config.json');

// Default configuration
const defaultConfig = {
    m3uUrl: '',
    username: '',
    password: '',
    outputPaths: {
        liveTV: './output/livetv',
        movies: './output/movies',
        series: './output/series'
    },
    schedule: {
        enabled: false,
        cron: '0 3 * * *' // Default: 3 AM daily
    },
    rules: {
        moviePatterns: [],
        seriesPatterns: [],
        liveTvPatterns: [],
        excludePatterns: []
    },
    presets: {
        active: 'default'
    }
};

/**
 * Load configuration from file
 */
async function loadConfig() {
    try {
        const data = await fs.readFile(CONFIG_PATH, 'utf-8');
        return { ...defaultConfig, ...JSON.parse(data) };
    } catch (err) {
        return defaultConfig;
    }
}

/**
 * Save configuration to file
 */
async function saveConfig(config) {
    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

// GET /api/config - Get current configuration
router.get('/config', async (req, res) => {
    try {
        const config = await loadConfig();
        res.json({ success: true, config });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/config - Save configuration
router.post('/config', async (req, res) => {
    try {
        const existingConfig = await loadConfig();
        const newConfig = { ...existingConfig, ...req.body };
        await saveConfig(newConfig);

        // Update scheduler if schedule changed
        if (req.body.schedule) {
            updateSchedule(newConfig.schedule);
        }

        res.json({ success: true, config: newConfig });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/process - Start processing
router.post('/process', async (req, res) => {
    try {
        const config = await loadConfig();
        const io = req.app.get('io');

        if (!config.m3uUrl) {
            return res.status(400).json({
                success: false,
                error: 'M3U URL is required'
            });
        }

        // Start processing in background
        processPlaylist(config, io).catch(err => {
            io.emit('error', { message: err.message });
        });

        res.json({
            success: true,
            message: 'Processing started'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/status - Get processing status
router.get('/status', async (req, res) => {
    try {
        const scheduler = getScheduler();
        res.json({
            success: true,
            scheduler: {
                enabled: scheduler.enabled,
                nextRun: scheduler.nextRun
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/presets - Get available presets
router.get('/presets', async (req, res) => {
    const presets = {
        default: {
            name: 'Default',
            description: 'Standard IPTV format detection',
            moviePatterns: ['\\|\\s*(?:FHD|HD|SD)?\\s*(?:Movie|Film|Cinema)', 'VOD.*Movie'],
            seriesPatterns: ['S\\d{1,2}\\s*E\\d{1,2}', 'Season\\s*\\d+.*Episode\\s*\\d+', '\\|.*Series'],
            liveTvPatterns: ['\\|\\s*(?:LIVE|TV|CHANNEL)', '^(?!.*(Movie|VOD|Series)).*$']
        },
        xtream: {
            name: 'Xtream Codes',
            description: 'Optimized for Xtream Codes format',
            moviePatterns: ['/movie/', 'group-title=".*(?:Movies?|Films?|VOD)"'],
            seriesPatterns: ['/series/', 'group-title=".*Series"', 'S\\d{2}E\\d{2}'],
            liveTvPatterns: ['/live/', 'group-title=".*(?:Live|TV|Channel)"']
        },
        turkish: {
            name: 'Turkish IPTV',
            description: 'Optimized for Turkish IPTV providers',
            moviePatterns: ['TR:\\s*Film', 'SİNEMA', 'FİLM'],
            seriesPatterns: ['TR:\\s*Dizi', 'S\\d{2}E\\d{2}', 'Sezon\\s*\\d+.*Bölüm\\s*\\d+'],
            liveTvPatterns: ['TR:', 'türk', 'CANLI']
        }
    };

    res.json({ success: true, presets });
});

// POST /api/browse-folder - Open folder picker dialog
router.post('/browse-folder', async (req, res) => {
    try {
        // Node.js doesn't have native folder picker
        // This endpoint provides a way to list directories
        // The actual folder selection happens on client side

        // For Electron apps, you could use dialog.showOpenDialog
        // For web apps, we return a helper response
        res.json({
            success: false,
            message: 'Klasör yolunu manuel olarak girin',
            suggestions: [
                './output/livetv',
                './output/movies',
                './output/series',
                'C:/Jellyfin/Media/LiveTV',
                'C:/Jellyfin/Media/Movies',
                'C:/Jellyfin/Media/Series'
            ]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/parse-url - Extract credentials from URL
router.post('/parse-url', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ success: false, error: 'URL gerekli' });
        }

        const urlObj = new URL(url);
        const username = urlObj.searchParams.get('username');
        const password = urlObj.searchParams.get('password');
        const type = urlObj.searchParams.get('type');
        const output = urlObj.searchParams.get('output');

        // Build base URL for different formats
        const baseUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;

        res.json({
            success: true,
            credentials: {
                username,
                password
            },
            format: {
                type: type || 'm3u',
                output: output || 'ts'
            },
            baseUrl,
            availableFormats: [
                { type: 'm3u', output: 'ts', label: 'M3U (TS)' },
                { type: 'm3u', output: 'm3u8', label: 'M3U (HLS)' },
                { type: 'm3u_plus', output: 'ts', label: 'M3U Plus (TS)' },
                { type: 'adv_m3u_icon', output: 'ts', label: 'Advanced M3U with Icons' }
            ]
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: `URL ayrıştırılamadı: ${error.message}`
        });
    }
});

// POST /api/test-url - Test M3U URL accessibility
router.post('/test-url', async (req, res) => {
    try {
        const { url, username, password } = req.body;

        let testUrl = url;
        if (username && password) {
            const urlObj = new URL(url);
            urlObj.searchParams.set('username', username);
            urlObj.searchParams.set('password', password);
            testUrl = urlObj.toString();
        }

        const response = await fetch(testUrl, { method: 'HEAD' });

        res.json({
            success: response.ok,
            status: response.status,
            contentType: response.headers.get('content-type')
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: `URL'ye erişilemiyor: ${error.message}`
        });
    }
});
