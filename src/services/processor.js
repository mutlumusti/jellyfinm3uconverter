/**
 * Ana Playlist İşleyici
 * Tüm işlem hattını yönetir
 */

import { downloadM3U, parseM3U, categorizeEntries, extractSeriesInfo, extractMovieInfo, cleanName } from './m3u-parser.js';
import { generateLiveTVPlaylist, generateSTRMFile, ensureDirectory, sanitizeFilename } from './file-generator.js';
import path from 'path';

/**
 * Tüm playlisti işle
 * @param {Object} config - Uygulama yapılandırması
 * @param {Object} io - Gerçek zamanlı güncellemeler için Socket.IO örneği
 */
export async function processPlaylist(config, io) {
    const startTime = Date.now();
    let stats = {
        total: 0,
        liveTV: 0,
        movies: 0,
        series: 0,
        errors: 0
    };

    try {
        // Adım 1: M3U İndir
        emitLog(io, 'info', '📥 M3U playlisti indiriliyor...');
        emitProgress(io, 'download', 0, 'İndirme başlatılıyor...');

        const m3uContent = await downloadM3U(config.m3uUrl, config.username, config.password);

        const contentSize = (Buffer.byteLength(m3uContent, 'utf8') / 1024 / 1024).toFixed(2);
        emitLog(io, 'success', `✅ ${contentSize} MB playlist verisi indirildi`);
        emitProgress(io, 'download', 100, 'İndirme tamamlandı');

        // Adım 2: M3U Ayrıştır
        emitLog(io, 'info', '🔍 Playlist kayıtları ayrıştırılıyor...');
        emitProgress(io, 'parse', 0, 'Kayıtlar ayrıştırılıyor...');

        const entries = parseM3U(m3uContent);
        stats.total = entries.length;

        emitLog(io, 'success', `✅ Playlistte ${entries.length} kayıt bulundu`);
        emitProgress(io, 'parse', 100, `${entries.length} kayıt ayrıştırıldı`);

        // Adım 3: Kayıtları Kategorize Et
        emitLog(io, 'info', '📂 İçerik kategorilendiriliyor...');
        emitProgress(io, 'categorize', 0, 'Kayıtlar kategorilendiriliyor...');

        const categories = categorizeEntries(entries, config.rules);

        stats.liveTV = categories.liveTV.length;
        stats.movies = categories.movies.length;
        stats.series = categories.series.length;

        emitLog(io, 'success', `✅ Kategorilendi: ${stats.liveTV} Canlı TV, ${stats.movies} Film, ${stats.series} Dizi`);
        emitProgress(io, 'categorize', 100, 'Kategorilendirme tamamlandı');

        // Adım 4: Canlı TV playlisti oluştur
        if (categories.liveTV.length > 0) {
            emitLog(io, 'info', '📺 Canlı TV playlisti oluşturuluyor...');
            emitProgress(io, 'livetv', 0, 'Canlı TV M3U oluşturuluyor...');

            try {
                await ensureDirectory(config.outputPaths.liveTV);
                const liveTVPath = path.join(config.outputPaths.liveTV, 'livetv.m3u');
                await generateLiveTVPlaylist(categories.liveTV, liveTVPath);

                emitLog(io, 'success', `✅ Canlı TV playlisti kaydedildi: ${liveTVPath}`);
            } catch (err) {
                emitLog(io, 'error', `❌ Canlı TV playlisti oluşturma hatası: ${err.message}`);
                stats.errors++;
            }

            emitProgress(io, 'livetv', 100, 'Canlı TV tamamlandı');
        }

        // Adım 5: Film STRM dosyaları oluştur
        if (categories.movies.length > 0) {
            emitLog(io, 'info', '🎬 Film STRM dosyaları oluşturuluyor...');

            await ensureDirectory(config.outputPaths.movies);

            let processed = 0;
            for (const movie of categories.movies) {
                try {
                    const movieInfo = extractMovieInfo(movie.originalName);
                    let movieDir = sanitizeFilename(movieInfo.title);

                    if (movieInfo.year) {
                        movieDir += ` (${movieInfo.year})`;
                    }

                    const moviePath = path.join(config.outputPaths.movies, movieDir);
                    await ensureDirectory(moviePath);

                    const strmPath = path.join(moviePath, `${sanitizeFilename(movieInfo.title)}.strm`);
                    await generateSTRMFile(movie.url, strmPath);

                    processed++;
                    const progress = Math.round((processed / categories.movies.length) * 100);
                    emitProgress(io, 'movies', progress, `Filmler işleniyor: ${processed}/${categories.movies.length}`);

                    // Her 50 filmde bir logla
                    if (processed % 50 === 0) {
                        emitLog(io, 'info', `📝 ${processed}/${categories.movies.length} film işlendi...`);
                    }
                } catch (err) {
                    emitLog(io, 'warn', `⚠️ Film işleme hatası "${movie.name}": ${err.message}`);
                    stats.errors++;
                }
            }

            emitLog(io, 'success', `✅ ${processed} film STRM dosyası oluşturuldu`);
            emitProgress(io, 'movies', 100, 'Filmler tamamlandı');
        }

        // Adım 6: Dizi STRM dosyaları oluştur
        if (categories.series.length > 0) {
            emitLog(io, 'info', '📺 Dizi STRM dosyaları oluşturuluyor...');

            await ensureDirectory(config.outputPaths.series);

            let processed = 0;
            const seriesMap = new Map(); // Benzersiz dizileri takip et

            for (const episode of categories.series) {
                try {
                    const seriesInfo = extractSeriesInfo(episode.originalName);
                    const seriesDir = sanitizeFilename(seriesInfo.title);
                    const seasonDir = `Sezon ${String(seriesInfo.season).padStart(2, '0')}`;

                    const episodePath = path.join(
                        config.outputPaths.series,
                        seriesDir,
                        seasonDir
                    );

                    await ensureDirectory(episodePath);

                    // Bölüm dosya adını oluştur
                    let episodeFilename = `${sanitizeFilename(seriesInfo.title)} - S${String(seriesInfo.season).padStart(2, '0')}E${String(seriesInfo.episode).padStart(2, '0')}`;
                    if (seriesInfo.episodeTitle) {
                        episodeFilename += ` - ${sanitizeFilename(seriesInfo.episodeTitle)}`;
                    }
                    episodeFilename += '.strm';

                    const strmPath = path.join(episodePath, episodeFilename);
                    await generateSTRMFile(episode.url, strmPath);

                    seriesMap.set(seriesDir, (seriesMap.get(seriesDir) || 0) + 1);

                    processed++;
                    const progress = Math.round((processed / categories.series.length) * 100);
                    emitProgress(io, 'series', progress, `Diziler işleniyor: ${processed}/${categories.series.length}`);

                    // Her 100 bölümde bir logla
                    if (processed % 100 === 0) {
                        emitLog(io, 'info', `📝 ${processed}/${categories.series.length} bölüm işlendi...`);
                    }
                } catch (err) {
                    emitLog(io, 'warn', `⚠️ Bölüm işleme hatası "${episode.name}": ${err.message}`);
                    stats.errors++;
                }
            }

            emitLog(io, 'success', `✅ ${seriesMap.size} dizi için ${processed} bölüm STRM dosyası oluşturuldu`);
            emitProgress(io, 'series', 100, 'Diziler tamamlandı');
        }

        // Tamamlandı!
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        emitLog(io, 'success', `
╔══════════════════════════════════════════════════════════════╗
║                    İŞLEM TAMAMLANDI                          ║
╠══════════════════════════════════════════════════════════════╣
║  Toplam Kayıt:      ${String(stats.total).padEnd(40)}║
║  Canlı TV Kanalı:   ${String(stats.liveTV).padEnd(40)}║
║  Film:              ${String(stats.movies).padEnd(40)}║
║  Dizi Bölümü:       ${String(stats.series).padEnd(40)}║
║  Hata:              ${String(stats.errors).padEnd(40)}║
║  Süre:              ${String(duration + ' saniye').padEnd(40)}║
╚══════════════════════════════════════════════════════════════╝
    `);

        io.emit('complete', { stats, duration });

    } catch (error) {
        emitLog(io, 'error', `❌ Kritik hata: ${error.message}`);
        io.emit('error', { message: error.message, stack: error.stack });
        throw error;
    }
}

/**
 * Socket.IO ile log mesajı gönder
 */
function emitLog(io, level, message) {
    io.emit('log', {
        timestamp: new Date().toISOString(),
        level,
        message
    });
}

/**
 * Socket.IO ile ilerleme güncellemesi gönder
 */
function emitProgress(io, stage, percent, message) {
    io.emit('progress', {
        stage,
        percent,
        message
    });
}
