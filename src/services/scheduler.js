/**
 * Zamanlayıcı Servisi
 * Cron tabanlı zamanlanmış playlist işleme
 */

import cron from 'node-cron';

let scheduledTask = null;
let processCallbackFn = null;
let configLoaderFn = null;
let ioInstance = null;

let schedulerState = {
    enabled: false,
    cronExpression: '',
    nextRun: null,
    lastRun: null
};

/**
 * Mevcut zamanlayıcı durumunu al
 * @returns {Object} Zamanlayıcı durumu
 */
export function getScheduler() {
    return { ...schedulerState };
}

/**
 * Zamanlayıcıyı başlat
 * @param {Function} processCallback - Zamanlanmış işlem fonksiyonu
 * @param {Function} configLoader - Yapılandırma yükleyici fonksiyon
 * @param {Object} io - Socket.IO örneği
 */
export function initScheduler(processCallback, configLoader, io) {
    processCallbackFn = processCallback;
    configLoaderFn = configLoader;
    ioInstance = io;
    console.log('📅 Zamanlayıcı servisi başlatıldı');
}

/**
 * Zamanlama yapılandırmasını güncelle
 * @param {Object} scheduleConfig - Zamanlama yapılandırması
 */
export function updateSchedule(scheduleConfig) {
    // Mevcut zamanlamayı durdur
    if (scheduledTask) {
        scheduledTask.stop();
        scheduledTask = null;
        console.log('⏹️ Mevcut zamanlama durduruldu');
    }

    if (!scheduleConfig.enabled) {
        schedulerState = {
            enabled: false,
            cronExpression: '',
            nextRun: null,
            lastRun: schedulerState.lastRun
        };
        console.log('⏸️ Zamanlayıcı devre dışı bırakıldı');
        return { success: true, message: 'Zamanlayıcı devre dışı' };
    }

    // Cron ifadesini doğrula
    if (!cron.validate(scheduleConfig.cron)) {
        console.error(`❌ Geçersiz cron ifadesi: ${scheduleConfig.cron}`);
        return { success: false, error: `Geçersiz cron ifadesi: ${scheduleConfig.cron}` };
    }

    // Yeni zamanlanmış görevi oluştur
    scheduledTask = cron.schedule(scheduleConfig.cron, async () => {
        console.log('⏰ Zamanlanmış görev tetiklendi:', new Date().toLocaleString('tr-TR'));

        schedulerState.lastRun = new Date().toISOString();

        if (processCallbackFn && configLoaderFn && ioInstance) {
            try {
                const config = await configLoaderFn();
                console.log('🔄 Zamanlanmış işlem başlatılıyor...');

                // Socket.IO'ya bildir
                ioInstance.emit('log', {
                    timestamp: new Date().toISOString(),
                    level: 'info',
                    message: '⏰ Zamanlanmış işlem başlatıldı'
                });

                await processCallbackFn(config, ioInstance);

                console.log('✅ Zamanlanmış işlem tamamlandı');
            } catch (error) {
                console.error('❌ Zamanlanmış işlem hatası:', error.message);

                ioInstance.emit('log', {
                    timestamp: new Date().toISOString(),
                    level: 'error',
                    message: `⏰ Zamanlanmış işlem hatası: ${error.message}`
                });
            }
        } else {
            console.error('❌ Zamanlayıcı bileşenleri hazır değil');
        }
    }, {
        scheduled: true,
        timezone: 'Europe/Istanbul'
    });

    schedulerState = {
        enabled: true,
        cronExpression: scheduleConfig.cron,
        nextRun: getNextRunTime(scheduleConfig.cron),
        lastRun: schedulerState.lastRun
    };

    console.log(`✅ Zamanlayıcı etkinleştirildi: ${scheduleConfig.cron}`);
    console.log(`📅 Sonraki çalışma: ${schedulerState.nextRun}`);

    return { success: true, message: 'Zamanlayıcı etkinleştirildi', nextRun: schedulerState.nextRun };
}

/**
 * Cron ifadesinden sonraki çalışma zamanını hesapla
 * @param {string} cronExpression - Cron ifadesi
 * @returns {string|null} ISO string olarak sonraki çalışma zamanı
 */
function getNextRunTime(cronExpression) {
    try {
        // Basit hesaplama - dakika, saat, gün bazında
        const parts = cronExpression.split(' ');
        const now = new Date();

        const minute = parts[0] === '*' ? now.getMinutes() : parseInt(parts[0]) || 0;
        const hour = parts[1] === '*' ? now.getHours() : parseInt(parts[1]) || 0;
        const dayOfMonth = parts[2] === '*' ? now.getDate() : parseInt(parts[2]) || now.getDate();
        const dayOfWeek = parts[4] === '*' ? null : parseInt(parts[4]);

        let nextRun = new Date();
        nextRun.setSeconds(0);
        nextRun.setMilliseconds(0);
        nextRun.setMinutes(minute);
        nextRun.setHours(hour);

        // Eğer bugün için zaman geçtiyse, yarına al
        if (nextRun <= now) {
            if (parts[1] === '*') {
                // Her saat - bir sonraki saat
                nextRun.setHours(now.getHours() + 1);
                nextRun.setMinutes(minute);
            } else if (dayOfWeek !== null) {
                // Haftalık
                const currentDay = now.getDay();
                let daysUntil = dayOfWeek - currentDay;
                if (daysUntil <= 0) daysUntil += 7;
                nextRun.setDate(now.getDate() + daysUntil);
            } else if (parts[2] !== '*') {
                // Aylık
                nextRun.setMonth(now.getMonth() + 1);
                nextRun.setDate(dayOfMonth);
            } else {
                // Günlük
                nextRun.setDate(now.getDate() + 1);
            }
        }

        return nextRun.toLocaleString('tr-TR', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'Europe/Istanbul'
        });
    } catch (e) {
        return 'Hesaplanamadı';
    }
}

/**
 * Zamanlayıcıyı manuel olarak çalıştır (test için)
 */
export async function triggerNow() {
    if (processCallbackFn && configLoaderFn && ioInstance) {
        const config = await configLoaderFn();
        await processCallbackFn(config, ioInstance);
        schedulerState.lastRun = new Date().toISOString();
    }
}

/**
 * Yaygın cron şablonları
 */
export const CRON_PRESETS = {
    hourly: { cron: '0 * * * *', label: 'Her saat' },
    daily_3am: { cron: '0 3 * * *', label: 'Her gün saat 03:00' },
    daily_midnight: { cron: '0 0 * * *', label: 'Her gün gece yarısı' },
    weekly: { cron: '0 3 * * 0', label: 'Haftalık (Pazar 03:00)' },
    twice_daily: { cron: '0 3,15 * * *', label: 'Günde iki kez (03:00 & 15:00)' }
};
