/**
 * IPTV İşleyici - Frontend Uygulaması
 */

// Dil çevirileri
const translations = {
    tr: {
        appTitle: 'IPTV İşleyici',
        heroTitle: 'IPTV Playlistinizi Dönüştürün',
        heroDesc: 'M3U playlistlerini otomatik olarak ayrıştırın ve Jellyfin uyumlu STRM dosyaları oluşturun',
        configuration: 'Yapılandırma',
        preset: 'Şablon:',
        presetDefault: 'Varsayılan',
        presetTurkish: 'Türk IPTV',
        m3uSource: 'M3U Kaynağı',
        m3uUrl: "M3U Playlist URL'si",
        testBtn: 'Test Et',
        urlHint: "IPTV sağlayıcınızdan aldığınız M3U playlist URL'si (kullanıcı adı ve şifre otomatik algılanır)",
        username: 'Kullanıcı Adı',
        password: 'Şifre',
        autoDetected: '(otomatik algılanır)',
        outputFormat: 'Çıktı Formatı',
        outputPaths: 'Çıktı Dizinleri',
        liveTvPath: 'Canlı TV Çıktı Yolu',
        moviesPath: 'Film Çıktı Yolu',
        seriesPath: 'Dizi Çıktı Yolu',
        browse: 'Gözat',
        scheduling: 'Zamanlama',
        enableSchedule: 'Zamanlanmış İşlemeyi Etkinleştir',
        frequency: 'Sıklık',
        hourly: 'Her Saat',
        daily: 'Günlük',
        weekly: 'Haftalık',
        monthly: 'Aylık',
        day: 'Gün',
        monthDay: 'Ayın Günü',
        time: 'Saat',
        lastDay: 'Son gün',
        nextRun: 'Sonraki çalışma:',
        saveConfig: 'Yapılandırmayı Kaydet',
        startProcess: 'İşlemeyi Başlat',
        processing: 'İşleniyor...',
        processStatus: 'İşlem Durumu',
        waiting: 'Bekliyor',
        connected: 'Bağlandı',
        disconnected: 'Bağlantı Kesildi',
        completed: 'Tamamlandı',
        error: 'Hata',
        download: 'İndirme',
        parsing: 'Ayrıştırma',
        categorizing: 'Kategorilendirme',
        liveTV: 'Canlı TV',
        movies: 'Filmler',
        series: 'Diziler',
        totalRecords: 'Toplam Kayıt',
        movie: 'Film',
        seriesStat: 'Dizi',
        activityLog: 'Etkinlik Günlüğü',
        clear: 'Temizle',
        footer: 'IPTV İşleyici v1.0 • Jellyfin için tasarlandı',
        waitingConnection: 'Bağlantı bekleniyor...',
        // Günler
        sunday: 'Pazar',
        monday: 'Pazartesi',
        tuesday: 'Salı',
        wednesday: 'Çarşamba',
        thursday: 'Perşembe',
        friday: 'Cuma',
        saturday: 'Cumartesi',
        days: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
        everyDayAt: 'Her gün saat',
        everyHour: 'Her saat başı',
        every: 'Her',
        at: 'saat',
        monthDayAt: 'Her ayın',
        dayAt: '. günü saat',
        lastDayAt: 'Her ayın son günü saat'
    },
    en: {
        appTitle: 'IPTV Processor',
        heroTitle: 'Transform Your IPTV Playlist',
        heroDesc: 'Automatically parse M3U playlists and generate Jellyfin-compatible STRM files',
        configuration: 'Configuration',
        preset: 'Preset:',
        presetDefault: 'Default',
        presetTurkish: 'Turkish IPTV',
        m3uSource: 'M3U Source',
        m3uUrl: 'M3U Playlist URL',
        testBtn: 'Test',
        urlHint: 'M3U playlist URL from your IPTV provider (username and password auto-detected)',
        username: 'Username',
        password: 'Password',
        autoDetected: '(auto-detected)',
        outputFormat: 'Output Format',
        outputPaths: 'Output Directories',
        liveTvPath: 'Live TV Output Path',
        moviesPath: 'Movies Output Path',
        seriesPath: 'Series Output Path',
        browse: 'Browse',
        scheduling: 'Scheduling',
        enableSchedule: 'Enable Scheduled Processing',
        frequency: 'Frequency',
        hourly: 'Hourly',
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
        day: 'Day',
        monthDay: 'Day of Month',
        time: 'Time',
        lastDay: 'Last day',
        nextRun: 'Next run:',
        saveConfig: 'Save Configuration',
        startProcess: 'Start Processing',
        processing: 'Processing...',
        processStatus: 'Process Status',
        waiting: 'Waiting',
        connected: 'Connected',
        disconnected: 'Disconnected',
        completed: 'Completed',
        error: 'Error',
        download: 'Download',
        parsing: 'Parsing',
        categorizing: 'Categorizing',
        liveTV: 'Live TV',
        movies: 'Movies',
        series: 'Series',
        totalRecords: 'Total Records',
        movie: 'Movie',
        seriesStat: 'Series',
        activityLog: 'Activity Log',
        clear: 'Clear',
        footer: 'IPTV Processor v1.0 • Designed for Jellyfin',
        waitingConnection: 'Waiting for connection...',
        // Days
        sunday: 'Sunday',
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        everyDayAt: 'Every day at',
        everyHour: 'Every hour',
        every: 'Every',
        at: 'at',
        monthDayAt: 'Every',
        dayAt: ' of the month at',
        lastDayAt: 'Last day of every month at'
    }
};

let currentLang = 'tr';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLang();
    initSocket();
    initFormHandlers();
    loadConfig();
});

// Rakamları binlik ayraçlı formatla
function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString(currentLang === 'tr' ? 'tr-TR' : 'en-US');
}

// Tema Yönetimi
function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

// Dil Yönetimi
function initLang() {
    const savedLang = localStorage.getItem('lang') || 'tr';
    currentLang = savedLang;

    const langToggle = document.getElementById('lang-toggle');
    const langMenu = document.getElementById('lang-menu');
    const currentFlag = document.getElementById('current-flag');

    // Bayrak güncelle
    currentFlag.src = currentLang === 'tr' ? 'images/flag-tr.svg' : 'images/flag-en.svg';
    currentFlag.alt = currentLang === 'tr' ? 'TR' : 'EN';

    // Dropdown aç/kapa
    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        langMenu.classList.toggle('open');
    });

    // Dışarı tıklayınca kapat
    document.addEventListener('click', () => {
        langMenu.classList.remove('open');
    });

    // Dil seçenekleri
    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = option.dataset.lang;
            currentLang = lang;
            localStorage.setItem('lang', lang);
            currentFlag.src = lang === 'tr' ? 'images/flag-tr.svg' : 'images/flag-en.svg';
            currentFlag.alt = lang === 'tr' ? 'TR' : 'EN';
            langMenu.classList.remove('open');
            applyTranslations();
            updateSchedulePreview();
        });
    });

    applyTranslations();
}

function t(key) {
    return translations[currentLang][key] || translations['tr'][key] || key;
}

function applyTranslations() {
    // data-i18n attribute'u olan tüm elemanları güncelle
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = t(key);
        if (text) {
            el.textContent = text;
        }
    });

    // Logo
    const logoText = document.querySelector('.logo-text');
    if (logoText) logoText.textContent = t('appTitle');

    // Placeholder'ları güncelle
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    if (usernameInput) usernameInput.placeholder = currentLang === 'tr' ? "URL'den otomatik alınacak" : 'Auto-detected from URL';
    if (passwordInput) passwordInput.placeholder = currentLang === 'tr' ? "URL'den otomatik alınacak" : 'Auto-detected from URL';

    const pathInputs = document.querySelectorAll('input[id^="path-"]');
    pathInputs.forEach(input => {
        input.placeholder = currentLang === 'tr' ? 'Klasör seçin veya yol girin' : 'Select folder or enter path';
    });

    // Hint metinlerini güncelle
    const hints = {
        'path-livetv': { tr: 'Temizlenmiş M3U playlist için dizin', en: 'Directory for cleaned M3U playlist' },
        'path-movies': { tr: 'Film STRM dosyaları için dizin', en: 'Directory for movie STRM files' },
        'path-series': { tr: 'Dizi STRM dosyaları için dizin (Sezona göre düzenlenir)', en: 'Directory for series STRM files (organized by season)' }
    };

    Object.keys(hints).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            const hint = input.parentElement?.nextElementSibling;
            if (hint && hint.classList.contains('input-hint')) {
                hint.textContent = hints[id][currentLang];
            }
        }
    });
}

// Socket.IO
let socket;
function initSocket() {
    socket = io();

    socket.on('connect', () => {
        updateStatus('connected', 'Bağlandı');
        addLog('info', '🔌 Sunucuya bağlandı');
    });

    socket.on('disconnect', () => {
        updateStatus('disconnected', 'Bağlantı Kesildi');
        addLog('error', '❌ Sunucu bağlantısı kesildi');
    });

    socket.on('log', (data) => addLog(data.level, data.message));
    socket.on('progress', (data) => updateProgress(data.stage, data.percent));

    socket.on('complete', (data) => {
        updateStatus('complete', t('completed'));
        showToast('success', currentLang === 'tr' ? 'İşlem başarıyla tamamlandı!' : 'Processing completed successfully!');
        if (data.stats) {
            document.getElementById('stat-total').textContent = formatNumber(data.stats.total || 0);
            document.getElementById('stat-livetv').textContent = formatNumber(data.stats.liveTV || 0);
            document.getElementById('stat-movies').textContent = formatNumber(data.stats.movies || 0);
            document.getElementById('stat-series').textContent = formatNumber(data.stats.series || 0);
        }
        enableProcessButton();
    });

    socket.on('error', (data) => {
        updateStatus('error', 'Hata');
        showToast('error', data.message);
        enableProcessButton();
    });
}

// URL'den kullanıcı adı ve şifre çıkar
function extractCredentialsFromUrl(url) {
    try {
        const urlObj = new URL(url);
        const username = urlObj.searchParams.get('username');
        const password = urlObj.searchParams.get('password');
        return { username, password };
    } catch (e) {
        return { username: null, password: null };
    }
}

// Form İşleyicileri
function initFormHandlers() {
    const form = document.getElementById('config-form');
    const startBtn = document.getElementById('start-process');
    const testBtn = document.getElementById('test-url');
    const scheduleEnabled = document.getElementById('schedule-enabled');
    const clearLogBtn = document.getElementById('clear-log');
    const m3uUrlInput = document.getElementById('m3u-url');

    // URL değiştiğinde kullanıcı adı ve şifreyi otomatik al
    m3uUrlInput.addEventListener('input', () => {
        const url = m3uUrlInput.value;
        const { username, password } = extractCredentialsFromUrl(url);

        if (username) {
            document.getElementById('username').value = username;
            document.getElementById('username').placeholder = 'Otomatik algılandı';
        }
        if (password) {
            document.getElementById('password').value = password;
            document.getElementById('password').placeholder = 'Otomatik algılandı';
        }
    });

    // URL yapıştırıldığında da çalıştır
    m3uUrlInput.addEventListener('paste', (e) => {
        setTimeout(() => {
            const url = m3uUrlInput.value;
            const { username, password } = extractCredentialsFromUrl(url);

            if (username) {
                document.getElementById('username').value = username;
            }
            if (password) {
                document.getElementById('password').value = password;
            }
        }, 100);
    });

    form.addEventListener('submit', async (e) => { e.preventDefault(); await saveConfig(); });
    startBtn.addEventListener('click', startProcessing);
    testBtn.addEventListener('click', testUrl);

    // Zamanlama toggle
    scheduleEnabled.addEventListener('change', () => {
        document.getElementById('schedule-options').classList.toggle('active', scheduleEnabled.checked);
    });

    // Zamanlama sıklık değişimi
    const scheduleFrequency = document.getElementById('schedule-frequency');
    const dayGroup = document.getElementById('day-group');
    const monthdayGroup = document.getElementById('monthday-group');
    const timeGroup = document.getElementById('time-group');

    scheduleFrequency.addEventListener('change', () => {
        const freq = scheduleFrequency.value;
        dayGroup.style.display = freq === 'weekly' ? 'block' : 'none';
        monthdayGroup.style.display = freq === 'monthly' ? 'block' : 'none';
        timeGroup.style.display = freq === 'hourly' ? 'none' : 'block';
        updateSchedulePreview();
    });

    // Zamanlama önizlemesi güncelle
    document.getElementById('schedule-day')?.addEventListener('change', updateSchedulePreview);
    document.getElementById('schedule-monthday')?.addEventListener('change', updateSchedulePreview);
    document.getElementById('schedule-time')?.addEventListener('change', updateSchedulePreview);

    clearLogBtn.addEventListener('click', () => {
        document.getElementById('log-container').innerHTML = '<div class="log-entry info"><span class="log-time">--:--:--</span><span class="log-message">Günlük temizlendi</span></div>';
    });

    // Klasör seçme butonları
    document.querySelectorAll('.btn-browse').forEach(btn => {
        btn.addEventListener('click', async () => {
            const targetId = btn.getAttribute('data-target');
            await browseFolder(targetId);
        });
    });

    // İlk önizlemeyi göster
    updateSchedulePreview();
}

// Zamanlama önizlemesi güncelle
function updateSchedulePreview() {
    const freq = document.getElementById('schedule-frequency')?.value || 'daily';
    const day = document.getElementById('schedule-day')?.value || '0';
    const monthday = document.getElementById('schedule-monthday')?.value || '1';
    const time = document.getElementById('schedule-time')?.value || '03:00';

    const days = t('days');

    let preview = '';
    switch (freq) {
        case 'hourly':
            preview = t('everyHour');
            break;
        case 'daily':
            if (currentLang === 'tr') {
                preview = `Her gün saat ${time}'te`;
            } else {
                preview = `Every day at ${time}`;
            }
            break;
        case 'weekly':
            if (currentLang === 'tr') {
                preview = `Her ${days[parseInt(day)]} saat ${time}'te`;
            } else {
                preview = `Every ${days[parseInt(day)]} at ${time}`;
            }
            break;
        case 'monthly':
            if (monthday === 'last') {
                if (currentLang === 'tr') {
                    preview = `Her ayın son günü saat ${time}'te`;
                } else {
                    preview = `Last day of every month at ${time}`;
                }
            } else {
                if (currentLang === 'tr') {
                    preview = `Her ayın ${monthday}. günü saat ${time}'te`;
                } else {
                    preview = `${monthday}${getOrdinalSuffix(monthday)} of every month at ${time}`;
                }
            }
            break;
    }

    const previewEl = document.getElementById('schedule-preview');
    if (previewEl) previewEl.textContent = preview;
}

// İngilizce sıra eki
function getOrdinalSuffix(n) {
    const num = parseInt(n);
    if (num === 1 || num === 21) return 'st';
    if (num === 2 || num === 22) return 'nd';
    if (num === 3 || num === 23) return 'rd';
    return 'th';
}

// Cron ifadesi oluştur
function buildCronExpression() {
    const freq = document.getElementById('schedule-frequency')?.value || 'daily';
    const day = document.getElementById('schedule-day')?.value || '0';
    const monthday = document.getElementById('schedule-monthday')?.value || '1';
    const time = document.getElementById('schedule-time')?.value || '03:00';

    const [hour, minute] = time.split(':').map(Number);

    switch (freq) {
        case 'hourly':
            return '0 * * * *';
        case 'daily':
            return `${minute} ${hour} * * *`;
        case 'weekly':
            return `${minute} ${hour} * * ${day}`;
        case 'monthly':
            if (monthday === 'last') {
                return `${minute} ${hour} L * *`; // node-cron desteklemeyebilir
            }
            return `${minute} ${hour} ${monthday} * *`;
        default:
            return '0 3 * * *';
    }
}

// Klasör seçme - Electron API kullan veya web fallback
async function browseFolder(targetId) {
    // Electron içinde mi kontrol et
    if (window.electronAPI && window.electronAPI.selectFolder) {
        try {
            const folderPath = await window.electronAPI.selectFolder();
            if (folderPath) {
                document.getElementById(targetId).value = folderPath;
                showToast('success', 'Klasör seçildi: ' + folderPath);
            }
        } catch (e) {
            showToast('error', 'Klasör seçme hatası: ' + e.message);
        }
    } else {
        // Web tarayıcısı için - dosya sistemi yok, modal göster
        showFolderInputModal(targetId);
    }
}

// Web tarayıcısı için manuel klasör girişi modalı
function showFolderInputModal(targetId) {
    const currentValue = document.getElementById(targetId).value;
    const labels = {
        'path-livetv': 'Canlı TV',
        'path-movies': 'Film',
        'path-series': 'Dizi'
    };

    const suggestions = [
        './output/' + (targetId === 'path-livetv' ? 'livetv' : targetId === 'path-movies' ? 'movies' : 'series'),
        'C:/Jellyfin/Media/' + (targetId === 'path-livetv' ? 'LiveTV' : targetId === 'path-movies' ? 'Movies' : 'Series'),
        'D:/Media/' + (targetId === 'path-livetv' ? 'LiveTV' : targetId === 'path-movies' ? 'Movies' : 'Series')
    ];

    // Mevcut modal varsa kaldır
    const existingModal = document.getElementById('folder-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'folder-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
    <div class="modal-content">
      <h3>📂 ${labels[targetId] || 'Çıktı'} Klasör Yolu</h3>
      <p>Dosyaların kaydedileceği klasör yolunu girin:</p>
      <input type="text" id="folder-input" value="${currentValue}" placeholder="Örn: C:/Jellyfin/Media/Movies">
      <div class="suggestions">
        <span>Öneriler:</span>
        ${suggestions.map(s => `<button type="button" class="suggestion-btn" data-path="${s}">${s}</button>`).join('')}
      </div>
      <div class="modal-actions">
        <button type="button" class="btn-secondary" id="modal-cancel">İptal</button>
        <button type="button" class="btn-accent" id="modal-confirm">Onayla</button>
      </div>
    </div>
  `;

    document.body.appendChild(modal);

    // Event listeners
    document.getElementById('modal-cancel').onclick = () => modal.remove();
    document.getElementById('modal-confirm').onclick = () => {
        const value = document.getElementById('folder-input').value;
        if (value) {
            document.getElementById(targetId).value = value;
            showToast('success', 'Klasör yolu ayarlandı');
        }
        modal.remove();
    };

    modal.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.onclick = () => {
            document.getElementById('folder-input').value = btn.dataset.path;
        };
    });

    // ESC ile kapat
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };

    // Focus input
    document.getElementById('folder-input').focus();
}

// API Fonksiyonları
async function loadConfig() {
    try {
        const res = await fetch('/api/config');
        const data = await res.json();
        if (data.success && data.config) populateForm(data.config);
    } catch (e) { showToast('error', 'Yapılandırma yüklenemedi'); }
}

function populateForm(cfg) {
    document.getElementById('m3u-url').value = cfg.m3uUrl || '';
    document.getElementById('username').value = cfg.username || '';
    document.getElementById('password').value = cfg.password || '';

    // Çıktı formatı
    if (cfg.outputFormat) {
        const formatRadio = document.querySelector(`input[name="outputFormat"][value="${cfg.outputFormat}"]`);
        if (formatRadio) formatRadio.checked = true;
    }

    if (cfg.outputPaths) {
        document.getElementById('path-livetv').value = cfg.outputPaths.liveTV || '';
        document.getElementById('path-movies').value = cfg.outputPaths.movies || '';
        document.getElementById('path-series').value = cfg.outputPaths.series || '';
    }

    if (cfg.schedule) {
        document.getElementById('schedule-enabled').checked = cfg.schedule.enabled;
        document.getElementById('schedule-options').classList.toggle('active', cfg.schedule.enabled);

        // Yeni zamanlama alanları
        if (cfg.schedule.frequency) {
            document.getElementById('schedule-frequency').value = cfg.schedule.frequency;

            // Gün/ay grubu görünürlüğü
            const dayGroup = document.getElementById('day-group');
            const monthdayGroup = document.getElementById('monthday-group');
            const timeGroup = document.getElementById('time-group');

            dayGroup.style.display = cfg.schedule.frequency === 'weekly' ? 'block' : 'none';
            monthdayGroup.style.display = cfg.schedule.frequency === 'monthly' ? 'block' : 'none';
            timeGroup.style.display = cfg.schedule.frequency === 'hourly' ? 'none' : 'block';
        }
        if (cfg.schedule.day) {
            document.getElementById('schedule-day').value = cfg.schedule.day;
        }
        if (cfg.schedule.monthday) {
            document.getElementById('schedule-monthday').value = cfg.schedule.monthday;
        }
        if (cfg.schedule.time) {
            document.getElementById('schedule-time').value = cfg.schedule.time;
        }

        updateSchedulePreview();
    }
}

async function saveConfig() {
    const outputFormat = document.querySelector('input[name="outputFormat"]:checked')?.value || 'ts';

    const config = {
        m3uUrl: document.getElementById('m3u-url').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        outputFormat: outputFormat,
        outputPaths: {
            liveTV: document.getElementById('path-livetv').value || './output/livetv',
            movies: document.getElementById('path-movies').value || './output/movies',
            series: document.getElementById('path-series').value || './output/series'
        },
        schedule: {
            enabled: document.getElementById('schedule-enabled').checked,
            cron: buildCronExpression(),
            frequency: document.getElementById('schedule-frequency')?.value || 'daily',
            day: document.getElementById('schedule-day')?.value || '0',
            monthday: document.getElementById('schedule-monthday')?.value || '1',
            time: document.getElementById('schedule-time')?.value || '03:00'
        }
    };

    try {
        const res = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
        const data = await res.json();
        showToast(data.success ? 'success' : 'error', data.success ? 'Yapılandırma kaydedildi!' : (data.error || 'Kaydetme başarısız'));
    } catch (e) { showToast('error', 'Kaydetme başarısız'); }
}

async function startProcessing() {
    if (!document.getElementById('m3u-url').value) { showToast('warning', 'Önce M3U URL\'si girin'); return; }
    await saveConfig();
    resetProgress();
    updateStatus('running', 'İşleniyor...');
    disableProcessButton();

    try {
        const res = await fetch('/api/process', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
        const data = await res.json();
        if (!data.success) { showToast('error', data.error || 'Başarısız'); updateStatus('error', 'Hata'); enableProcessButton(); }
    } catch (e) { showToast('error', 'Başarısız'); updateStatus('error', 'Hata'); enableProcessButton(); }
}

async function testUrl() {
    const url = document.getElementById('m3u-url').value;
    if (!url) { showToast('warning', 'Önce URL girin'); return; }
    const btn = document.getElementById('test-url');
    btn.disabled = true; btn.textContent = 'Test Ediliyor...';

    try {
        const res = await fetch('/api/test-url', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url, username: document.getElementById('username').value, password: document.getElementById('password').value }) });
        const data = await res.json();
        showToast(data.success ? 'success' : 'error', data.success ? 'URL erişilebilir!' : (data.error || 'Erişilemiyor'));
    } catch (e) { showToast('error', 'Test başarısız'); }
    btn.disabled = false; btn.textContent = 'Test Et';
}

// UI Güncellemeleri
function updateStatus(status, text) {
    const el = document.getElementById('status-indicator');
    el.className = 'status-indicator ' + status;
    el.querySelector('.status-text').textContent = text;
}

function updateProgress(stage, percent) {
    const item = document.querySelector(`.progress-item[data-stage="${stage}"]`);
    if (item) {
        item.querySelector('.progress-value').textContent = `${percent}%`;
        item.querySelector('.progress-fill').style.width = `${percent}%`;
    }
}

function resetProgress() {
    document.querySelectorAll('.progress-item').forEach(item => {
        item.querySelector('.progress-value').textContent = '0%';
        item.querySelector('.progress-fill').style.width = '0%';
    });
    ['stat-total', 'stat-livetv', 'stat-movies', 'stat-series'].forEach(id => document.getElementById(id).textContent = '0');
}

function addLog(level, message) {
    const container = document.getElementById('log-container');
    const time = new Date().toLocaleTimeString('tr-TR', { hour12: false });
    const entry = document.createElement('div');
    entry.className = `log-entry ${level}`;
    entry.innerHTML = `<span class="log-time">${time}</span><span class="log-message">${escapeHtml(message)}</span>`;
    container.appendChild(entry);
    container.scrollTop = container.scrollHeight;
    while (container.children.length > 500) container.removeChild(container.firstChild);
}

function escapeHtml(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

function disableProcessButton() {
    const btn = document.getElementById('start-process');
    btn.disabled = true;
    btn.innerHTML = '<svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>İşleniyor...';
}

function enableProcessButton() {
    const btn = document.getElementById('start-process');
    btn.disabled = false;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>İşlemeyi Başlat';
}

function showToast(type, message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    toast.innerHTML = `<span>${icons[type]}</span><span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'slideIn 300ms ease reverse'; setTimeout(() => toast.remove(), 300); }, 5000);
}

// Spin animasyonu ekle
const style = document.createElement('style');
style.textContent = '.spin{animation:spin 1s linear infinite}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}';
document.head.appendChild(style);
